/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  686669576: {
    ETFLock: {
      address: "0x84827596bFd9D4e9f723d448c751D78Fa506F386",
      abi: [
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_mainChain",
              type: "uint32",
            },
            {
              internalType: "uint32",
              name: "_chainId",
              type: "uint32",
            },
            {
              components: [
                {
                  internalType: "address",
                  name: "_address",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_quantity",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "_chainId",
                  type: "uint32",
                },
                {
                  internalType: "address",
                  name: "_contributor",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "_tokenId",
                  type: "uint64",
                },
              ],
              internalType: "struct TokenQuantity[]",
              name: "_requiredTokens",
              type: "tuple[]",
            },
            {
              internalType: "address",
              name: "_etfToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_etfTokenPerVault",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "_vaultId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "_address",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "_quantity",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint32",
              name: "_chainId",
              type: "uint32",
            },
            {
              indexed: false,
              internalType: "address",
              name: "_contributor",
              type: "address",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "accountContributionsPerVault",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "addressToToken",
          outputs: [
            {
              internalType: "address",
              name: "_address",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_quantity",
              type: "uint256",
            },
            {
              internalType: "uint32",
              name: "_chainId",
              type: "uint32",
            },
            {
              internalType: "address",
              name: "_contributor",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "_tokenId",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_vaultId",
              type: "uint256",
            },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "chainId",
          outputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "vaultId",
                  type: "uint256",
                },
                {
                  components: [
                    {
                      internalType: "address",
                      name: "_address",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "_quantity",
                      type: "uint256",
                    },
                    {
                      internalType: "uint32",
                      name: "_chainId",
                      type: "uint32",
                    },
                    {
                      internalType: "address",
                      name: "_contributor",
                      type: "address",
                    },
                    {
                      internalType: "uint64",
                      name: "_tokenId",
                      type: "uint64",
                    },
                  ],
                  internalType: "struct TokenQuantity[]",
                  name: "tokens",
                  type: "tuple[]",
                },
              ],
              internalType: "struct DepositInfo",
              name: "_depositInfo",
              type: "tuple",
            },
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "etfToken",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "etfTokenPerVault",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "_address",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_quantity",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "_chainId",
                  type: "uint32",
                },
                {
                  internalType: "address",
                  name: "_contributor",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "_tokenId",
                  type: "uint64",
                },
              ],
              internalType: "struct TokenQuantity",
              name: "_tokenQuantity",
              type: "tuple",
            },
          ],
          name: "getIndexForDepositInfo",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getRequiredTokens",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "_address",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_quantity",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "_chainId",
                  type: "uint32",
                },
                {
                  internalType: "address",
                  name: "_contributor",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "_tokenId",
                  type: "uint64",
                },
              ],
              internalType: "struct TokenQuantity[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_vaultId",
              type: "uint256",
            },
          ],
          name: "getVault",
          outputs: [
            {
              components: [
                {
                  components: [
                    {
                      internalType: "address",
                      name: "_address",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "_quantity",
                      type: "uint256",
                    },
                    {
                      internalType: "uint32",
                      name: "_chainId",
                      type: "uint32",
                    },
                    {
                      internalType: "address",
                      name: "_contributor",
                      type: "address",
                    },
                    {
                      internalType: "uint64",
                      name: "_tokenId",
                      type: "uint64",
                    },
                  ],
                  internalType: "struct TokenQuantity[]",
                  name: "_tokens",
                  type: "tuple[]",
                },
                {
                  internalType: "enum VaultState",
                  name: "state",
                  type: "uint8",
                },
              ],
              internalType: "struct Vault",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getVaultStates",
          outputs: [
            {
              internalType: "enum VaultState[]",
              name: "",
              type: "uint8[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_origin",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "_sender",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "_message",
              type: "bytes",
            },
          ],
          name: "handle",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "isMainChain",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "mainChainId",
          outputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "mainChainLock",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "receivedMessages",
          outputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "requiredTokens",
          outputs: [
            {
              internalType: "address",
              name: "_address",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_quantity",
              type: "uint256",
            },
            {
              internalType: "uint32",
              name: "_chainId",
              type: "uint32",
            },
            {
              internalType: "address",
              name: "_contributor",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "_tokenId",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_sideChainLock",
              type: "address",
            },
            {
              internalType: "uint32",
              name: "_sideChainId",
              type: "uint32",
            },
            {
              internalType: "address",
              name: "_outbox",
              type: "address",
            },
            {
              internalType: "address",
              name: "_securityModule",
              type: "address",
            },
            {
              internalType: "address",
              name: "_quasarAddress",
              type: "address",
            },
          ],
          name: "setMainChainParams",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_mainChainLock",
              type: "address",
            },
            {
              internalType: "address",
              name: "_outbox",
              type: "address",
            },
            {
              internalType: "address",
              name: "_securityModule",
              type: "address",
            },
          ],
          name: "setSideChainParams",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_vaultId",
              type: "uint256",
            },
            {
              internalType: "enum VaultState",
              name: "_state",
              type: "uint8",
            },
          ],
          name: "setVaultState",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "sideChainId",
          outputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "sideChainLock",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "vaults",
          outputs: [
            {
              internalType: "enum VaultState",
              name: "state",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
    Quasar: {
      address: "0xa7fC563eFa7f2B737E41Bf975e6cF1D46f0E4Ed8",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "symbol",
              type: "string",
            },
          ],
          name: "CurrencyAdded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "state",
              type: "bool",
            },
          ],
          name: "CurrencyStateChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "symbol",
              type: "string",
            },
          ],
          name: "CurrencyUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          name: "PriceUpdated",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol",
              type: "string",
            },
          ],
          name: "addCurrency",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "state",
              type: "bool",
            },
          ],
          name: "changeCurrencyState",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "symbol",
              type: "string",
            },
          ],
          name: "getCurrencyID",
          outputs: [
            {
              internalType: "uint64",
              name: "",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
          ],
          name: "getCurrencyMetadata",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
              ],
              internalType: "struct Quasar.Currency",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getNextID",
          outputs: [
            {
              internalType: "uint64",
              name: "",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
          ],
          name: "getPrice",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedCurrencies",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
              ],
              internalType: "struct Quasar.Currency[]",
              name: "",
              type: "tuple[]",
            },
            {
              internalType: "bool[]",
              name: "",
              type: "bool[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
          ],
          name: "isCurrencySupported",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          name: "pushPrice",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "id",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol",
              type: "string",
            },
          ],
          name: "updateCurrency",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        owner: "@openzeppelin/contracts/access/Ownable.sol",
        renounceOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        transferOwnership: "@openzeppelin/contracts/access/Ownable.sol",
      },
    },
    SimpleERC20: {
      address: "0x73a7d1B252300b2e2e9a1119D1E490C6F9bf9c9B",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "initialSupply",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "subtractedValue",
              type: "uint256",
            },
          ],
          name: "decreaseAllowance",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "addedValue",
              type: "uint256",
            },
          ],
          name: "increaseAllowance",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          name: "setOwner",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        allowance: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        approve: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        balanceOf: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        decimals: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        decreaseAllowance: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        increaseAllowance: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        name: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        symbol: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        totalSupply: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        transfer: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
        transferFrom: "@openzeppelin/contracts/token/ERC20/ERC20.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
