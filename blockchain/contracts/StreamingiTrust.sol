// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface IStake {
    function notifyRewardAmount(uint128 _amount) external;
}

contract StreamingiTrust{

    IStake private immutable stake;
    IERC20 private immutable wbnb;


    constructor(address _stake, address _wbnb){
        stake = IStake(_stake);
        wbnb = IERC20(_wbnb);
        wbnb.approve(_stake,100000 ether);
    }

    function depositStake(uint128 _amount) external{
        stake.notifyRewardAmount(_amount);
    }


}
