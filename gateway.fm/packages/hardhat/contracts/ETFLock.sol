// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ISimpleERC20 } from "./SimpleERC20.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import { IInterchainSecurityModule } from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";
import "@redstone-finance/evm-connector/contracts/data-services/RapidDemoConsumerBase.sol";
import {IQuasar} from "./Quasar.sol";

struct TokenQuantity {
	address _address;
	uint256 _quantity;
	uint32 _chainId;
	address _contributor;
	uint64 _tokenId;
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

contract ETFLock {
	address public sideChainLock;
	uint32 public sideChainId;
	TokenQuantity[] public requiredTokens;
	mapping(address => TokenQuantity) public addressToToken;
	uint32 public chainId;
	uint32 public mainChainId;

	address quasarAddress;

	uint32[] public receivedMessages;

	// Siechain params
	address public mainChainLock;
	IMailbox outbox;
	IInterchainSecurityModule securityModule;

	// Mainchain params
	address public etfToken;
	uint256 public etfTokenPerVault;

	mapping(uint256 => address[]) contributorsByVault;
	mapping(uint256 => mapping(address => uint256))
		public accountContributionsPerVault;

	event Deposit(
		uint256 _vaultId,
		address _address,
		uint256 _quantity,
		uint32 _chainId,
		address _contributor
	);

	mapping(uint256 => Vault) public vaults;

	constructor(
		uint32 _mainChain,
		uint32 _chainId,
		TokenQuantity[] memory _requiredTokens,
		address _etfToken,
		uint256 _etfTokenPerVault
	) {
		mainChainId = _mainChain;
		chainId = _chainId;
		etfToken = _etfToken;
		etfTokenPerVault = _etfTokenPerVault;
		for (uint256 i = 0; i < _requiredTokens.length; i++) {
			requiredTokens.push(_requiredTokens[i]);
			addressToToken[_requiredTokens[i]._address] = _requiredTokens[i];
		}
	}

	function setSideChainParams(
		address _mainChainLock,
		address _outbox,
		address _securityModule
	) public {
		require(
			!isMainChain(),
			"Main chain lock address cannot be set on main chain"
		);
		mainChainLock = _mainChainLock;
		outbox = IMailbox(_outbox);
		securityModule = IInterchainSecurityModule(_securityModule);
	}

	function setMainChainParams(
		address _sideChainLock,
		uint32 _sideChainId,
		address _outbox,
		address _securityModule,
		address _quasarAddress
	) public {
		require(
			isMainChain(),
			"Side Chain lock address can only be set mainchain"
		);
		outbox = IMailbox(_outbox);
		sideChainId = _sideChainId;
		securityModule = IInterchainSecurityModule(_securityModule);
		sideChainLock = _sideChainLock;
		quasarAddress = _quasarAddress;
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

	function getRequiredTokens() public view returns (TokenQuantity[] memory) {
		return requiredTokens;
	}

	function setVaultState(uint256 _vaultId, VaultState _state) public {
		vaults[_vaultId].state = _state;
	}

	function isMainChain() public view returns (bool) {
		return chainId == mainChainId;
	}


	function getIndexForDepositInfo(TokenQuantity memory _tokenQuantity) public view returns (uint256) {
		// return the index of the token in the requiredTokens array
		for (uint256 i = 0; i < requiredTokens.length; i++) {
			if (requiredTokens[i]._address == _tokenQuantity._address) {
				return i;
			}
		}
		return 0;
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

		require(_chainId == chainId, "ChainId does not match the contract chainId");

		if (vaults[_vaultId].state == VaultState.EMPTY) {
			for (uint256 i = 0; i < requiredTokens.length; i++) {
				vaults[_vaultId]._tokens.push(
					TokenQuantity(
						requiredTokens[i]._address,
						0,
						requiredTokens[i]._chainId,
						address(0),
						requiredTokens[i]._tokenId
					)
				);
			}
			vaults[_vaultId].state = VaultState.OPEN;
		}

		for (uint256 i = 0; i < _tokens.length; i++) {
			if (_tokens[i]._chainId != _chainId) {
				revert(
					"Token chainId does not match the chainId of the contract"
				);
			}
			if (
				_tokens[i]._quantity + vaults[_vaultId]._tokens[i]._quantity >
				addressToToken[_tokens[i]._address]._quantity
			) {
				revert("Token quantity exceeds the required amount");
			}


			uint256 index = getIndexForDepositInfo(_tokens[i]);

			if (_tokens[i]._chainId == _chainId) {
				IERC20(_tokens[i]._address).transferFrom(
					_tokens[i]._contributor,
					address(this),
					_tokens[i]._quantity
				);
			}

			
			vaults[_vaultId]._tokens[index]._quantity += _tokens[i]._quantity;

			emit Deposit(
				_vaultId,
				_tokens[i]._address,
				_tokens[i]._quantity,
				_tokens[i]._chainId,
				_tokens[i]._contributor
			);

			if (isMainChain()) {
				if (accountContributionsPerVault[_vaultId][_tokens[i]._contributor] == 0) {
					contributorsByVault[_vaultId].push(_tokens[i]._contributor);
				}

				// bytes32[] memory dataFeedIds = new bytes32[](6);
				// dataFeedIds[0] = bytes32("BNB");
				// uint256[] memory prices = 

				// uint256 price = prices[0];

				//  CHAINLINK INTERFACE
				// uint256 price = AggregatorV3Interface(_tokens[i]._aggregator).latestRoundData().answer;

				// Quasar Interface
				uint256 price = IQuasar(quasarAddress).getPrice(_tokens[i]._tokenId);

				// (, /* uint80 roundID */ int answer, , , ) = AggregatorV3Interface(
				// 	_tokens[i]._aggregator
				// ).latestRoundData();

				accountContributionsPerVault[_vaultId][_tokens[i]._contributor] += _tokens[i]
					._quantity * price;
			}
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

		if (isMainChain()) {
			distributeShares(_vaultId);
		} else {
			notifyDepositToMainChain(_depositInfo);
		}
	}

	function notifyDepositToMainChain(
		DepositInfo memory _depositInfo
	) internal {
		bytes32 mainChainLockBytes32 = addressToBytes32(mainChainLock);
		uint256 fee = outbox.quoteDispatch(
			mainChainId,
			mainChainLockBytes32,
			abi.encode(_depositInfo)
		);
		outbox.dispatch{ value: fee }(
			mainChainId,
			mainChainLockBytes32,
			abi.encode(_depositInfo)
		);
	}

	function distributeShares(uint256 _vaultId) internal {
		uint256 totalContributions = 0;
		for (uint256 i = 0; i < contributorsByVault[_vaultId].length; i++) {
			totalContributions += accountContributionsPerVault[_vaultId][
				contributorsByVault[_vaultId][i]
			];
		}

		for (uint256 i = 0; i < contributorsByVault[_vaultId].length; i++) {
			uint256 shares = (accountContributionsPerVault[_vaultId][
				contributorsByVault[_vaultId][i]
			] * etfTokenPerVault) / totalContributions;
			ISimpleERC20(etfToken).mint(
				contributorsByVault[_vaultId][i],
				shares
			);
		}
	}

	function deposit(DepositInfo memory _depositInfo) public payable {
		_deposit(_depositInfo, chainId);
	}

	function handle(
		uint32 _origin,
		bytes32 _sender,
		bytes calldata _message
	) external payable {
		require(
			isMainChain() && bytes32ToAddress(_sender) == sideChainLock,
			"Sender to mainChain is not the sideChainLock"
		);

		require(
			!isMainChain() && bytes32ToAddress(_sender) == mainChainLock,
			"Sender to sideChain is not the mainChainLock"
		);


		if(isMainChain()) {
			DepositInfo memory _depositInfo = abi.decode(_message, (DepositInfo));
			// uint32 _chainId = _depositInfo.tokens[0]._chainId;
			_deposit(_depositInfo, chainId);
			return;
		}
		else {
			uint256 _vaultId = abi.decode(_message, (uint256));
			burn(_vaultId);
		}
	}

	function burn(uint256 _vaultId) public {
		require(
			vaults[_vaultId].state == VaultState.MINTED,
			"Vault is not minted"
		);
		// require to pay back the etfToken
		require(isMainChain(), "Only main chain can burn");
		ISimpleERC20(etfToken).burn(msg.sender, etfTokenPerVault);
		for (uint256 j = 0; j < vaults[_vaultId]._tokens.length; j++) {
			if (vaults[_vaultId]._tokens[j]._chainId == chainId) {
				IERC20(vaults[_vaultId]._tokens[j]._address).transfer(
					msg.sender,
					vaults[_vaultId]._tokens[j]._quantity
				);
			}
		}
		vaults[_vaultId].state = VaultState.BURNED;

		// notify burn to sidechain
		bytes32 sideChainLockBytes32 = addressToBytes32(sideChainLock);
		uint256 fee = outbox.quoteDispatch(
			sideChainId,
			sideChainLockBytes32,
			abi.encode(_vaultId)
		);
		outbox.dispatch{ value: fee }(
			sideChainId,
			sideChainLockBytes32,
			abi.encode(_vaultId)
		);
	}

	function addressToBytes32(address _addr) internal pure returns (bytes32) {
		return bytes32(uint256(uint160(_addr)));
	}

	function bytes32ToAddress(
		bytes32 _bytes32
	) internal pure returns (address) {
		return address(uint160(uint256(_bytes32)));
	}
}
