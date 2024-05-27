import React from "react";
import { sepolia, useAccount, useContractWrite, useSwitchNetwork } from "wagmi";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

const prestoChainId = 686669576;
const sepoliaChainId = 11155111;
const zeroAddress = "0x0000000000000000000000000000000000000000";

export function DepositButton({
  bundleId,
  state,
  tokenQuantities,
  chainId,
}: {
  bundleId: string;
  state: any;
  tokenQuantities: any;
  chainId: number;
}) {
  const contractsData = getAllContracts(chainId);
  const { address: connectedAddress } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  const {
    data: burn,
    isLoading: isburnLoading,
    writeAsync: burnAsync,
  } = useContractWrite({
    address: contractsData["ETFLock"]?.address,
    functionName: "burn",
    abi: contractsData["ETFLock"]?.abi,
    args: [bundleId],
  });

  const contractName = "ETFLock";
  const {
    data: deposit,
    isLoading: isdepLoading,
    writeAsync: depositAsync,
  } = useContractWrite({
    address: contractsData[contractName]?.address,
    functionName: "deposit",
    abi: contractsData[contractName]?.abi ? contractsData[contractName].abi : [],
    args: [
      {
        vaultId: bundleId,
        tokens: tokenQuantities
          ?.filter((tokenQuantity: any) => tokenQuantity._chainId === chainId)
          ?.map((tokenQuantity: any) => ({
            _address: tokenQuantity._address,
            _quantity: tokenQuantity._quantity.toString(),
            _chainId: tokenQuantity._chainId,
            _contributor: connectedAddress,
            _tokenId: 0,
            // _aggregator: contractsData["MockAggregator"]?.address || zeroAddress,
          })),
      },
    ],
    value: chainId === sepoliaChainId ? BigInt(10000000) : BigInt(0),
  });

  const {
    data: replayMessag,
    isLoading: isReplayLoading,
    writeAsync: replayMessageAsync,
  } = useContractWrite({
    address: contractsData[contractName]?.address,
    functionName: "deposit",
    abi: contractsData[contractName]?.abi,
    args: [
      {
        vaultId: bundleId,
        tokens: tokenQuantities?.map((tokenQuantity: any) => ({
          _address: tokenQuantity._address,
          _quantity: tokenQuantity._chainId !== chainId ? tokenQuantity._quantity : 0,
          _chainId: tokenQuantity._chainId,
          _contributor: connectedAddress,
          _tokenId: 0,
          // _aggregator: contractsData["MockAggregator"]?.address || "0x2a1F5eB3e84e58e6F1e565306298B9dE1273f203",
        })),
      },
    ],
  });

  return (
    <>
      {state < 2 ? (
        <>
          <button
            className="bg-green-500 hover:bg-green-700 text-white size font-bold py-2 px-6 rounded-full"
            style={{
              marginLeft: "4%",
              marginRight: "4%",
              cursor: "pointer",
              fontSize: "18px",
            }}
            onClick={async () => {
              console.log(
                "ciao",
                tokenQuantities
                  ?.filter((tokenQuantity: any) => tokenQuantity._chainId === chainId)
                  ?.map((tokenQuantity: any) => ({
                    _address: tokenQuantity._address,
                    _quantity: tokenQuantity._quantity.toString(),
                    _chainId: tokenQuantity._chainId,
                    _contributor: connectedAddress,
                    _tokenId: 0,
                    // _aggregator: contractsData["MockAggregator"]?.address || "0x2a1F5eB3e84e58e6F1e565306298B9dE1273f203",
                  })),
              );

              await depositAsync();
              // // sleep for 2 seconds
              await new Promise(r => setTimeout(r, 6000));
              window.location.reload();
            }}
            disabled={isdepLoading}
          >
            Deposit
          </button>
          <br></br>
          <hr></hr>

          <br></br>

          {/* {["42", "27", "12", "65", "7", "18", "71"].includes(bundleId.toString()) && (
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white size font-bold py-2 px-6 rounded-full"
              style={{
                marginLeft: "4%",
                marginRight: "4%",
                cursor: "pointer",
                fontSize: "18px",
              }}
              onClick={async () => {
                await replayMessageAsync();
                // sleep for 2 seconds
                await new Promise(r => setTimeout(r, 6000));
                window.location.reload();
              }}
              disabled={isdepLoading}
            >
              Fetch and Replay Messages
            </button>
          )} */}
        </>
      ) : state == 2 && chainId == prestoChainId ? (
        <button
          //   className="bg-green-500 hover:bg-green-700 text-white size font-bold py-2 px-6 rounded-full"
          className="bg-red-500 hover:bg-red-700 text-white size font-bold py-2 px-6 rounded-full"
          style={{
            marginLeft: "4%",
            marginRight: "4%",
            cursor: "pointer",
            fontSize: "18px",
          }}
          disabled={isburnLoading}
          onClick={async () => {
            await burnAsync();
            // reload the page
            await new Promise(r => setTimeout(r, 4000));

            window.location.reload();
          }}
        >
          Burn
        </button>
      ) : (
        <></>
      )}
      <br></br>
      {chainId == sepoliaChainId && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white size font-bold py-2 px-6 rounded-full"
          style={{ cursor: "pointer", fontSize: "16px" }}
          // switch chain to etherlink
          onClick={async () => {
            if (switchNetwork) {
              try {
                await switchNetwork(prestoChainId);
              } catch (e: any) {
                console.log(e);
              }
            }
          }}
        >
          Switch Mainchain
        </button>
      )}
    </>
  );
}
