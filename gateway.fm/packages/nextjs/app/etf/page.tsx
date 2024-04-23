// import { DebugContracts } from "./_components/DebugContracts";
"use client";

import { use, useEffect, useState } from "react";
import { TxReceipt, displayTxResult } from "../debug/_components/contract";
import { DepositButton } from "./_components/DepositButton";
import { DepositController } from "./_components/DepositController";
import { MatrixView } from "./_components/MatrixView";
import PieToken from "./_components/PieToken";
import TokenBalanceAllowance from "./_components/tokenBalanceAllowance";
import "./index.css";
import { BigNumber } from "@ethersproject/bignumber";
import { Watermark } from "antd";
import type { NextPage } from "next";
import { TransactionReceipt } from "viem";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

const prestoChainId = 686669576;
const sepoliaChainId = 11155111;

const ETF: NextPage = () => {
  const [bundleId, setBundleId] = useState<string>("1");
  const [bundles, setBundles] = useState<any>();
  const [vault, setVault] = useState<any>({});
  const [tokens, setTokens] = useState<any>([]);
  const [isMainChain, setIsMainChain] = useState<boolean>(false);

  const [quantityTokenA, setQuantityTokenA] = useState<any>("");
  const [quantityTokenB, setQuantityTokenB] = useState<any>("");
  const [quantityTokenC, setQuantityTokenC] = useState<any>("");

  const [etfTokenAddress, setEtfTokenAddress] = useState<any>("");

  // const [resultFee, setResultFee] = useState<any>();
  // const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const contractsData = getAllContracts(chain?.id);

  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;
  const { address: connectedAddress } = useAccount();

  const contractName = "ETFLock";

  const { isFetching: isFetToken, refetch: tokensFetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "getRequiredTokens",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  useEffect(() => {
    // Function to reload the page
    const reloadPage = () => {
      console.log("Network changed, reloading page...");
      window.location.reload();
    };

    // Set up an event listener for network changes
    window.ethereum.on("chainChanged", reloadPage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.ethereum.removeListener("chainChanged", reloadPage);
    };
  }, [chain]);

  const { isFetching: isETFTokenAddressFetching, refetch: etfTokenAddressFetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "etfToken",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
  });

  const { isFetching: isMainnetLoad, refetch: isMainnetFetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "isMainChain",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  const { isFetching, refetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "getVaultStates",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      notification.error(parsedErrror);
    },
  });

  const { isFetching: isVaultFet, refetch: vaultSate } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "getVault",
    abi: contractsData[contractName].abi,
    args: [bundleId],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      notification.error(parsedErrror);
    },
  });

  // const etfTokenAddress = "0x106d24F579D77fbe71CBBF169f6Dc376208e25b5";

  useEffect(() => {
    async function fetchData() {
      if (isFetching) {
        return;
      }
      if (refetch) {
        const { data } = await refetch();
        setBundles(data);
      }
    }
    fetchData();
  }, [bundles]);

  useEffect(() => {
    async function fetchData() {
      if (isMainnetLoad) {
        return;
      }
      if (isMainnetFetch) {
        const { data } = await isMainnetFetch();
        setIsMainChain(data as boolean);
      }
    }
    fetchData();
  }, [isMainChain]);

  useEffect(() => {
    async function fetchData() {
      if (isETFTokenAddressFetching) {
        return;
      }
      if (etfTokenAddressFetch) {
        const { data } = await etfTokenAddressFetch();
        setEtfTokenAddress(data);
      }
    }
    fetchData();
  }, [etfTokenAddress]);

  useEffect(() => {
    async function fetchData() {
      if (isVaultFet) {
        return;
      }
      if (vaultSate) {
        const { data } = await vaultSate();
        setVault(data);
      }
    }
    fetchData();
  }, [bundleId, vault]);

  useEffect(() => {
    async function fetchData() {
      if (isFetToken) {
        return;
      }
      if (tokensFetch) {
        const { data } = await tokensFetch();
        // console.log("tokens", data);
        setTokens(data);
      }
    }
    fetchData();
  }, [tokens]);

  useEffect(() => {
    if (!tokens || tokens.length < 1) {
      return;
    }

    setQuantityTokenA(tokens[0]._quantity.toString());

    if (!tokens || tokens.length < 2) {
      return;
    }

    setQuantityTokenB(tokens[1]._quantity.toString());
    setQuantityTokenC(tokens[2]._quantity.toString());
  }, [tokens]);

  return (
    <Watermark
      zIndex={-9}
      font={{
        fontSize: "30",
      }}
      style={
        // take the whole screen in the behind all the elements
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: "100%",
        }
      }
      content={chain?.id === prestoChainId ? ["Presto g.fm", "Main Chain"] : ["Sepolia", "Side Chain"]}
      // image="https://w7.pngwing.com/pngs/459/4/png-transparent-xrp-symbol-black-hd-logo.png"
      height={230}
      width={250}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          color: "black",
          // centering the card
          margin: "auto",
          width: "1000px",
          marginTop: "30px",
        }}
        className="card"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // take the whole width
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1 className="text-4xl my-0">ETF #{bundleId}</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              // centering the elements vertically
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img
              alt="tezos logo"
              width="100px"
              src="data:image/jpeg;base64,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"
            ></img>
          </div>
        </div>
        <br></br>
        {/* <p>{displayTxResult(contractsData[contractName].address)}</p> */}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {bundles && <MatrixView setBundleId={setBundleId} bundleId={bundleId} bundles={bundles} />}
          {vault && vault._tokens && <PieToken input={vault}></PieToken>}
        </div>
        {/* {JSON.stringify(isMainChain)} */}
        <br></br>
        {isMainChain && etfTokenAddress && <TokenBalanceAllowance name={"ETF"} tokenAddress={etfTokenAddress} />}
        {tokens &&
          tokens.map((token: any, index: number) => {
            return chain?.id === token._chainId ? (
              <TokenBalanceAllowance
                key={index}
                chainId={chain?.id || prestoChainId}
                name={index.toString()}
                tokenAddress={token._address}
              />
            ) : (
              <b>
                {index} Token:{" "}
                {
                  // only show first 4 characters of the address and last 4 characters of the address
                  token._address.slice(0, 6) +
                    "..." +
                    token._address.slice(token._address.length - 4, token._address.length)
                }{" "}
                on another chain (chainId:{token._chainId})
              </b>
            );
          })}

        <br></br>
        <br></br>
        <h1>Collateral Vault</h1>
        <p>Bundle ID: {bundleId}</p>
        <b>Required Tokens</b>
        {tokens &&
          tokens.map((token: any, index: number) => {
            return (
              <>
                <DepositController
                  key={index}
                  quantity={index === 0 ? quantityTokenA : index === 1 ? quantityTokenB : quantityTokenA}
                  setQuantity={index === 0 ? setQuantityTokenA : index === 1 ? setQuantityTokenB : setQuantityTokenC}
                  requiredQuantity={token._quantity}
                  tokenAddress={token._address}
                  chainId={token._chainId}
                />
              </>
            );
          })}

        <br></br>
        <DepositButton
          bundleId={bundleId}
          state={vault?.state}
          tokenQuantities={tokens?.map((token: any) => ({
            _address: token._address,
            _quantity: token._quantity,
            _chainId: token._chainId,
          }))}
          chainId={chain?.id ?? prestoChainId}
        ></DepositButton>
      </div>
    </Watermark>
  );
};

export default ETF;
