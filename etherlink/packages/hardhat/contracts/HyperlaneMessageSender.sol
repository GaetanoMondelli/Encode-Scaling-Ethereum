// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import { IInterchainSecurityModule } from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";

interface ISpecifiesInterchainSecurityModule {
	function interchainSecurityModule()
		external
		view
		returns (IInterchainSecurityModule);
}

contract HyperlaneMessageSender is ISpecifiesInterchainSecurityModule {
	IMailbox outbox;
	IInterchainSecurityModule securityModule;
	string public version = "1.0.1";


	event SentMessage(
		uint32 destinationDomain,
		bytes32 recipient,
		string message
	);

	constructor(address _outbox, address _securityModule) {
		outbox = IMailbox(_outbox);
		securityModule = IInterchainSecurityModule(_securityModule);
	}

	function addressToBytes32(address _addr) internal pure returns (bytes32) {
		return bytes32(uint256(uint160(_addr)));
	}

	function sendStringToAddress(
		uint32 _destinationDomain,
		address _recipientAddress,
		string calldata _message
	) external {
		bytes32 _recipient = addressToBytes32(_recipientAddress);
		uint256 fee = outbox.quoteDispatch(
			_destinationDomain,
			_recipient,
			bytes(_message)
		);
		outbox.dispatch{ value: fee }(
			_destinationDomain,
			_recipient,
			bytes(_message)
		);
		emit SentMessage(_destinationDomain, _recipient, _message);
	}

	function sendString(
		uint32 _destinationDomain,
		bytes32 _recipient,
		string calldata _message
	) external {
		uint256 fee = outbox.quoteDispatch(
			_destinationDomain,
			_recipient,
			bytes(_message)
		);
		outbox.dispatch{ value: fee }(
			_destinationDomain,
			_recipient,
			bytes(_message)
		);
		emit SentMessage(_destinationDomain, _recipient, _message);
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
