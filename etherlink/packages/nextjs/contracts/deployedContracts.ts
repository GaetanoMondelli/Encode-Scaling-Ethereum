/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  128123: {
    HyperlaneMessageSender: {
      address: "0x624F38939E86F6c91c1C47f33c6c1a726b0783F2",
      abi: [
        {
          inputs: [
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
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint32",
              name: "destinationDomain",
              type: "uint32",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "recipient",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "message",
              type: "string",
            },
          ],
          name: "SentMessage",
          type: "event",
        },
        {
          inputs: [],
          name: "interchainSecurityModule",
          outputs: [
            {
              internalType: "contract IInterchainSecurityModule",
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
              internalType: "uint32",
              name: "_destinationDomain",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "_recipient",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "_message",
              type: "string",
            },
          ],
          name: "sendString",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_destinationDomain",
              type: "uint32",
            },
            {
              internalType: "address",
              name: "_recipientAddress",
              type: "address",
            },
            {
              internalType: "string",
              name: "_message",
              type: "string",
            },
          ],
          name: "sendStringToAddress",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "version",
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
      ],
      inheritedFunctions: {},
    },
  },
  11155111: {
    HyperlaneMessageReceiver: {
      address: "0xf13e391d98c9Ae4E6024F7C6BC0701134ff866f1",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_inbox",
              type: "address",
            },
            {
              internalType: "address",
              name: "_securityModule",
              type: "address",
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
              internalType: "uint32",
              name: "origin",
              type: "uint32",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "sender",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
          ],
          name: "ReceivedMessage",
          type: "event",
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
          name: "interchainSecurityModule",
          outputs: [
            {
              internalType: "contract IInterchainSecurityModule",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastMessage",
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
          name: "lastSender",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "version",
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
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
