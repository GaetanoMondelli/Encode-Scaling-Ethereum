// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface ISpecifiesInterchainSecurityModule {
    function interchainSecurityModule()
        external
        view
        returns (IInterchainSecurityModule);
}

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import {IInterchainSecurityModule} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";

contract HyperlaneMessageReceiver is ISpecifiesInterchainSecurityModule {
	IMailbox inbox;
	IInterchainSecurityModule securityModule;

	bytes32 public lastSender;
	string public lastMessage;

	event ReceivedMessage(uint32 origin, bytes32 sender, bytes message);

	constructor(address _inbox, address _securityModule) {
		inbox = IMailbox(_inbox);
		securityModule = IInterchainSecurityModule(_securityModule);
	}

	function handle(
		uint32 _origin,
		bytes32 _sender,
		bytes calldata _message
	) external payable {
		lastSender = _sender;
		lastMessage = string(_message);
		emit ReceivedMessage(_origin, _sender, _message);
	}

	function interchainSecurityModule()
		external
		view
		override
		returns (IInterchainSecurityModule)
	{
        return securityModule;
    }
}