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
    mapping(uint => address) public ownerOf;
    mapping(uint => uint) public depositDate;


    function stake(uint tokenId) external nonReentrant{
        collection.safeTransferFrom(msg.sender,address(this),tokenId);
        ownerOf[tokenId] = msg.sender;
        depositDate[tokenId] = block.timestamp;
    }

    function withdraw(uint tokenId) external nonReentrant{
        require(ownerOf[tokenId] == msg.sender, "Unauthorized");
        delete ownerOf[tokenId];
        delete depositDate[tokenId];
        collection.safeTransferFrom(address(this), msg.sender, tokenId);
    }
}
