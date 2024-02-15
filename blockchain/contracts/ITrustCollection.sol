// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";

contract ITrustCollection is ERC721A {

    constructor()
        ERC721A("ITrustCollection", "ITC")
    {}

    function _startTokenId() internal override view virtual returns (uint256) {
        return 1;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmQJdFSUDHmMTV2NpzREV2Xv1wSZ2ZtNtr9p9PZ7zWHSNf/";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A)
        returns (string memory)
    {
        return string.concat(super.tokenURI(tokenId), ".json");
    }

    function mint() external {
        require(_nextTokenId() <= 100,"Total supply of collection was been reached");
        _mint(msg.sender,100);
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmcqJLYrxyydHWpcEpEBTRTF34JtHTDZUtcRP5rkRMQjei";
    }


}
