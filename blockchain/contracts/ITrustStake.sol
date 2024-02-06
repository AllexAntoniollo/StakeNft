// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ITrustStake is ERC721Holder, ReentrancyGuard, Ownable {


    
    IERC721 private collection;
    IERC20 public rewardsToken;
    uint public decimals;
    uint public totalStake;   
    uint public totalStakeEligible;   
    uint public poolAmount;
    uint public startedPeriod;
    uint public finishPeriod;
    uint public tokensPerMinute;
    uint public teste;

    struct StakeItem{
        uint itemId;
        uint tokenId;
        uint checkpoints;
        uint totalPayed;
        address payable owner;   
        bool eligible;
        bool withdrawed;
    }
    mapping(uint => StakeItem) public stakeItems;
    
    
    constructor(address _colection, address initialOwner, address _rewardToken) Ownable(initialOwner){
        collection = IERC721(_colection);
        rewardsToken = IERC20(_rewardToken);
        decimals = 8;
    }



    function stake(uint tokenId) external nonReentrant
    {
        collection.safeTransferFrom(msg.sender,address(this),tokenId);
        ++totalStake;
        stakeItems[tokenId].owner = payable(msg.sender);
        stakeItems[tokenId].tokenId = tokenId;
        stakeItems[tokenId].itemId = totalStake;
        stakeItems[tokenId].checkpoints = block.timestamp; 
        stakeItems[tokenId].withdrawed = false; 

    }


    function setTokenDistribution(uint _finishPeriod, uint amount) external onlyOwner{
        require(block.timestamp > finishPeriod, "Only 1 distribution for time");
        startedPeriod = block.timestamp;
        totalStakeEligible = totalStake;
        finishPeriod = _finishPeriod + block.timestamp;
        poolAmount = amount* 10**decimals;
        tokensPerMinute = (amount* 10**decimals)/((finishPeriod-startedPeriod)/60);
    }


    function withdraw(uint tokenId) external nonReentrant
    {
        require(stakeItems[tokenId].owner == msg.sender, "Unauthorized");
        uint checkpoint = stakeItems[tokenId].checkpoints;
        bool eligible = stakeItems[tokenId].eligible;
        delete stakeItems[tokenId];

        --totalStake;
        if(startedPeriod > checkpoint  || eligible == true){
            payStake(tokenId);
            tokensPerMinute = (poolAmount)/((finishPeriod-startedPeriod)/60);
            --totalStakeEligible;
            stakeItems[tokenId].withdrawed = true;
        }
        collection.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function payStake(uint tokenId) public{
        require(stakeItems[tokenId].checkpoints < startedPeriod || stakeItems[tokenId].eligible == true, "You are not eligible");
        require(stakeItems[tokenId].withdrawed != true,"You are not eligible");
        uint quantityMinutes;

        if(stakeItems[tokenId].checkpoints < startedPeriod){
            if(block.timestamp > finishPeriod){
                quantityMinutes = (finishPeriod - startedPeriod)/60;
            }else{
                quantityMinutes = (block.timestamp - startedPeriod)/60;
            }
        }else{
            quantityMinutes = (finishPeriod - startedPeriod)/60;
        }
        uint amount = (tokensPerMinute/totalStakeEligible)*quantityMinutes;
        rewardsToken.transfer(msg.sender,(amount*10**10)-(stakeItems[tokenId].totalPayed*10**10));
        if(stakeItems[tokenId].owner != address(0)){
            stakeItems[tokenId].checkpoints = block.timestamp;
            stakeItems[tokenId].eligible = true;
            stakeItems[tokenId].totalPayed += amount;
        }else{
            poolAmount = poolAmount - amount;
        }
  
        
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
}
