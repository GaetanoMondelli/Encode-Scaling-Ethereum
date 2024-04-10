// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import { IInterchainSecurityModule } from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";

interface ISpecifiesInterchainSecurityModule {
	function interchainSecurityModule()
		external
		view
		returns (IInterchainSecurityModule);
}

struct TokenQuantity {
	address _address;
	uint256 _quantity;
	uint32 _chainId;
	address _contributor;
}

struct Vault {
	TokenQuantity[] _tokens;
	VaultState state;
}

enum VaultState {
	EMPTY,
	OPEN,
	MINTED,
	BURNED
}

struct EventInfo {
	address sender;
	uint256 quantity;
	uint32 chainId;
	address contributor;
}

struct DepositInfo {
	uint256 vaultId;
	TokenQuantity[] tokens;
}

contract ETFSide is ISpecifiesInterchainSecurityModule {
	address public mainChainLock;
	TokenQuantity[] requiredTokens;
	uint32 public chainId;
	IMailbox outbox;
	IInterchainSecurityModule securityModule;

	event Deposit(
		uint256 _vaultId,
		address _address,
		uint256 _quantity,
		uint32 _chainId,
		address _contributor
	);

	mapping(uint256 => Vault) public vaults;

	constructor(
		uint32 _chainId,
		TokenQuantity[] memory _requiredTokens,
		address _outbox,
		address _securityModule
	) {
		chainId = _chainId;
		outbox = IMailbox(_outbox);
		securityModule = IInterchainSecurityModule(_securityModule);
		for (uint256 i = 0; i < _requiredTokens.length; i++) {
			requiredTokens.push(_requiredTokens[i]);
		}
	}

	function getVaultStates() public view returns (VaultState[] memory) {
		VaultState[] memory states = new VaultState[](90);
		for (uint256 i = 0; i < states.length; i++) {
			states[i] = vaults[i].state;
		}
		return states;
	}

	function getVault(uint256 _vaultId) public view returns (Vault memory) {
		return vaults[_vaultId];
	}

	function _deposit(
		DepositInfo memory _depositInfo,
		uint32 _chainId
	) internal {
		uint256 _vaultId = _depositInfo.vaultId;
		TokenQuantity[] memory _tokens = _depositInfo.tokens;
		require(
			vaults[_vaultId].state == VaultState.OPEN ||
				vaults[_vaultId].state == VaultState.EMPTY,
			"Vault is not open or empty"
		);

		for (uint256 i = 0; i < _tokens.length; i++) {
			if (_tokens[i]._chainId != _chainId) {
				revert(
					"Token chainId does not match the chainId of the contract"
				);
			}

			if (
				_tokens[i]._quantity + vaults[_vaultId]._tokens[i]._quantity >
				requiredTokens[i]._quantity
			) {
				revert("Token quantity exceeds the required amount");
			}

			IERC20(_tokens[i]._address).transferFrom(
				_tokens[i]._contributor,
				address(this),
				_tokens[i]._quantity
			);
			vaults[_vaultId]._tokens.push(_tokens[i]);

			emit Deposit(
				_vaultId,
				_tokens[i]._address,
				_tokens[i]._quantity,
				_tokens[i]._chainId,
				_tokens[i]._contributor
			);
		}

		for (uint256 i = 0; i < requiredTokens.length; i++) {
			if (
				vaults[_vaultId]._tokens[i]._quantity <
				requiredTokens[i]._quantity
			) {
				return;
			}
		}
		vaults[_vaultId].state = VaultState.MINTED;
	}

	function depositAndNotify(DepositInfo calldata _depositInfo) public {
		_deposit(_depositInfo, chainId);
		bytes32 mainChainLockBytes32 = addressToBytes32(mainChainLock);
		uint256 fee = outbox.quoteDispatch(
			chainId,
			mainChainLockBytes32,
			abi.encode(_depositInfo)
		);
		outbox.dispatch{ value: fee }(
			chainId,
			mainChainLockBytes32,
			abi.encode(_depositInfo)
		);
	}

	function handle(
		uint32 _origin,
		bytes32 _sender,
		bytes calldata _message
	) external payable {
		require(
			bytes32ToAddress(_sender) == mainChainLock,
			"Sender is not the sideChainLock"
		);

		DepositInfo memory _depositInfo = abi.decode(_message, (DepositInfo));
		uint32 _chainId = _depositInfo.tokens[0]._chainId;
		_deposit(_depositInfo, _chainId);
	}

	function burn(uint256 _vaultId) public {
		for (uint256 j = 0; j < vaults[_vaultId]._tokens.length; j++) {
			IERC20(vaults[_vaultId]._tokens[j]._address).transfer(
				msg.sender,
				vaults[_vaultId]._tokens[j]._quantity
			);
		}
	}

	function addressToBytes32(address _addr) internal pure returns (bytes32) {
		return bytes32(uint256(uint160(_addr)));
	}

	function bytes32ToAddress(
		bytes32 _bytes32
	) internal pure returns (address) {
		return address(uint160(uint256(_bytes32)));
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
