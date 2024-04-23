
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import  "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";


contract TestMailBox is MockMailbox {
    constructor(uint32 _domain) MockMailbox(_domain) {
    }
}