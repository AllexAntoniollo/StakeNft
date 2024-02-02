// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
contract ITrustStake is ERC721Holder, ReentrancyGuard {
    constructor(address _colection){
        collection = IERC721(_colection);
    }

    IERC721 public collection;
    uint public totalStake = 0;
    struct StakeItem{
        uint itemId;
        uint tokenId;
        address payable owner; 
        uint timestamp;       
    }
    mapping(uint => StakeItem) public stakeItems;


    function stake(uint tokenId) external nonReentrant{
        collection.safeTransferFrom(msg.sender,address(this),tokenId);
        ++totalStake;
        stakeItems[tokenId].owner = payable(msg.sender);
        stakeItems[tokenId].timestamp = block.timestamp;
        stakeItems[tokenId].tokenId = tokenId;
        stakeItems[tokenId].itemId = totalStake;
    }


    function withdraw(uint tokenId) external nonReentrant{
        require(stakeItems[tokenId].owner == msg.sender, "Unauthorized");
        delete stakeItems[tokenId];
        --totalStake;
        collection.safeTransferFrom(address(this), msg.sender, tokenId);
    }


    function fetchAllNfts() public view returns(StakeItem[] memory){

        StakeItem[] memory items = new StakeItem[](totalStake);
        uint currentIndex = 0;

        for(uint i=1; i <= 100; ++i){
            if(stakeItems[i].owner != address(0)){
                items[currentIndex] = stakeItems[i];
                ++currentIndex;
                if(currentIndex == totalStake)
                    break;
            }
        }

        return items; 
    }

    function fetchMyNfts() public view returns(StakeItem[] memory){
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
