// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ITrustStake is ERC721Holder, ReentrancyGuard, Ownable {


    
    IERC721 private immutable collection;
    IERC20 private immutable wbnb;

    uint private duration; //Duration of the distribution
    uint private finishAt; //Finish period of distribution
    uint private updatedAt; // Last timestamp updated
    uint private rewardRate; //Reward per second
    uint private rewardPerWeightStored; 
    mapping(address => uint) private userRewardPerWeightPaid; //Quantity colected by user
    mapping(address => uint) private rewards; //Rewards of the user earned

    uint private totalSupply; //Total weight of all NFTs
    mapping(address => uint) public balanceOf; // Total weight of a user
    uint public totalStake; //Number of total NFTs in stake


    struct StakeItem{
        uint itemId;
        uint tokenId;
        address payable owner;   
    }
    mapping(uint => StakeItem) private stakeItems;
    
    
    constructor(address _colection, address initialOwner, address _wbnb) Ownable(initialOwner){
        collection = IERC721(_colection);
        wbnb = IERC20(_wbnb);
    }


    function setRewardsDuration(uint _duration) external onlyOwner{
        require(finishAt < block.timestamp,"Reward duration not finished");
        duration = _duration;
    }

    function notifyRewardAmount(uint _amount) external onlyOwner updateReward(address(0)) {
        if(block.timestamp > finishAt){
            rewardRate = _amount / duration;
        }else{
            uint remainingRewards = rewardRate * (finishAt - block.timestamp);
            rewardRate = (remainingRewards + _amount) / duration;
        }

        require(rewardRate > 0, "Reward rate equal to 0");
        require(rewardRate * duration <= wbnb.balanceOf(address(this)), "Reward amount greather than the balance");

        finishAt = block.timestamp + duration;
        updatedAt = block.timestamp;
    }

    function stake(uint tokenId) external nonReentrant updateReward(msg.sender){
        collection.safeTransferFrom(msg.sender,address(this),tokenId);
        if(tokenId <= 25){
            balanceOf[msg.sender] += 3;
            totalSupply += 3;
        }else{
            balanceOf[msg.sender] += 1;
            totalSupply += 1;
        }
        ++totalStake;
        stakeItems[tokenId].owner = payable(msg.sender);
        stakeItems[tokenId].tokenId = tokenId;
        stakeItems[tokenId].itemId = totalStake;

    }

    function withdraw(uint tokenId) external nonReentrant updateReward(msg.sender) {
        require(stakeItems[tokenId].owner == msg.sender, "Unauthorized");
        if(tokenId <= 25){
            balanceOf[msg.sender] -= 3;
            totalSupply -= 3;
        }else{
            balanceOf[msg.sender] -= 1;
            totalSupply -= 1;
        }
        --totalStake;
        delete stakeItems[tokenId];
        collection.safeTransferFrom(address(this), msg.sender, tokenId);

    }

    function lastTimeRewardApplicable() private view returns(uint){
        return _min(block.timestamp, finishAt);
    }

    function rewardPerWeight() private view returns(uint){
        if(totalSupply == 0){
            return rewardPerWeightStored;
        }
        return rewardPerWeightStored + (rewardRate * (lastTimeRewardApplicable() - updatedAt) * 1e18) / totalSupply;
    }

    function earned(address _account) public view returns(uint){
        return (balanceOf[_account] * (rewardPerWeight() - userRewardPerWeightPaid[_account])) / 1e18 + rewards[_account];
    }
    function getReward() external nonReentrant updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        if(reward > 0){
            rewards[msg.sender] = 0;
            wbnb.transfer(msg.sender,reward);
        }
    }
    function _min(uint x, uint y) private pure returns(uint){
        return x <= y ? x : y;
    }

    function fetchMyNfts() external view returns(StakeItem[] memory){
        uint count = 0;
        uint total = 0;

        for(uint i=1;i <= 100; ++i){
            if(stakeItems[i].owner != address(0)){
                ++total;
                if(stakeItems[i].owner == address(msg.sender)){
                    ++count;
                }
                if(total == totalStake){
                    break;
                }
            }
        }

        StakeItem[] memory items = new StakeItem[](count);
        uint currentIndex = 0;
        if(count == 0){
            return items; 
        }else{
            for(uint i=1; i <= 100; ++i){
                if(stakeItems[i].owner == msg.sender){
                    items[currentIndex] = stakeItems[i];
                    ++currentIndex;
                    if(currentIndex == count){
                        break;
                    }
                }

            }
            return items;
        }
    }

    modifier updateReward(address _account){
        rewardPerWeightStored = rewardPerWeight();
        updatedAt = lastTimeRewardApplicable();
        if(_account != address(0)){
            rewards[_account] = earned(_account);
            userRewardPerWeightPaid[_account] = rewardPerWeightStored;
        }

        _;
    }
}
