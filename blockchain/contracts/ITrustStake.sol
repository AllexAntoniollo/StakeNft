// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ITrustStake is ERC721Holder, ReentrancyGuard, Ownable {
    constructor(address _colection, address initialOwner) Ownable(initialOwner){
        collection = IERC721(_colection);
    }

    IERC721 private collection;
    uint public totalStake = 0;
    uint public poolBNB;

    struct StakeItem{
        uint itemId;
        uint tokenId;
        address payable owner; 
        uint timestamp;    
        uint bnbReward;   
    }
    mapping(uint => StakeItem) private stakeItems;

    function payStakeAutomated() external onlyOwner{
        require(poolBNB > 0,"The pool does not have BNB to pay");
        uint value = ((poolBNB * 100) / totalStake) / 100;
        poolBNB = 0;
        uint currentIndex = 0;
        for(uint i=1; i <= 100; ++i){
            if(stakeItems[i].owner != address(0)){
                stakeItems[i].bnbReward = value;
                ++currentIndex;
                if(currentIndex == totalStake)
                    break;
            }
        }

    }

/*
    function payStakeManual(uint rewardDuration, uint rewardAmount) external onlyOwner{
        require(rewardAmount <= poolBNB,"The pool does not have enought BNB to pay");
        uint value = ((rewardAmount * 100) / totalStake) / 100;
        poolBNB = 0;
        uint currentIndex = 0;
        for(uint i=1; i <= 100; ++i){
            if(stakeItems[i].owner != address(0)){
                stakeItems[i].bnbReward = value;
                stakeItems[i].timestamp = block.timestamp + rewardDuration;
                ++currentIndex;
                if(currentIndex == totalStake)
                    break;
            }
        }

    }*/

    function stake(uint tokenId) external nonReentrant{
        collection.safeTransferFrom(msg.sender,address(this),tokenId);
        ++totalStake;
        stakeItems[tokenId].owner = payable(msg.sender);
        stakeItems[tokenId].timestamp = 0;
        stakeItems[tokenId].tokenId = tokenId;
        stakeItems[tokenId].itemId = totalStake;
        stakeItems[tokenId].bnbReward = 0;
    }

    function harvest(uint tokenId) external nonReentrant{
        require(stakeItems[tokenId].owner == msg.sender, "Unauthorized");
        payable(stakeItems[tokenId].owner).transfer(stakeItems[tokenId].bnbReward);
        stakeItems[tokenId].bnbReward = 0;
    }

    function withdraw(uint tokenId) external nonReentrant{
        require(stakeItems[tokenId].owner == msg.sender, "Unauthorized");
        payable(stakeItems[tokenId].owner).transfer(stakeItems[tokenId].bnbReward);
        delete stakeItems[tokenId];
        --totalStake;
        collection.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    receive() external payable {
        poolBNB += msg.value;
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
