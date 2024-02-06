// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor()
        ERC20("Token", "TKN")
    {}

    function mint(address to) public {
        _mint(to, 100 ether);
    }
}