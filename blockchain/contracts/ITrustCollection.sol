// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";

contract ITrust is ERC721A {

    constructor()
        ERC721A("ITrust", "ITM")
    {}

    function _startTokenId() internal override view virtual returns (uint256) {
        return 1;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://teal-causal-salamander-208.mypinata.cloud/";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A)
        returns (string memory)
    {
        return string.concat(super.tokenURI(tokenId));
    }

    function mint(uint256 quantity) external {
        require(_nextTokenId() <= 100,"Total supply of collection was been reached");
        _mint(msg.sender,quantity);
    }



}
