// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";

contract ITrust is ERC721A {
    constructor()
        ERC721A("ITrust", "ITM")
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://teal-causal-salamander-208.mypinata.cloud/";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A)
        returns (string memory)
    {
        return string.concat(_baseURI(), super.tokenURI(tokenId));
    }

    function mint(uint256 quantity) public {
        _mint(msg.sender,quantity);
    }



}
