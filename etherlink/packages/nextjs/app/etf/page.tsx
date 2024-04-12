// import { DebugContracts } from "./_components/DebugContracts";
"use client";

import { useEffect, useState } from "react";
import { TxReceipt, displayTxResult } from "../debug/_components/contract";
import { CollateralVaultView } from "./_components/CollateralVault";
import { Deposit } from "./_components/Deposit";
import { MatrixView } from "./_components/MatrixView";
import PieToken from "./_components/PieToken";
import "./index.css";
import { BigNumber } from "@ethersproject/bignumber";
import type { NextPage } from "next";
import { TransactionReceipt } from "viem";
import { useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

const ETF: NextPage = () => {
  const initialCollateralAmount = 1;

  const collateralAmount = BigNumber.from(initialCollateralAmount).mul(BigNumber.from(10).pow(18));
  const collateralAmountFee = collateralAmount.mul(2).div(100).add(collateralAmount);

  const contractsData = getAllContracts();
  const [bundleId, setBundleId] = useState<string>("1");
  const [bundles, setBundles] = useState<any>();
  const [vault, setVault] = useState<any>({});
  const [resultFee, setResultFee] = useState<any>();
  const [balance, setBalance] = useState<any>();
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;
  const { address: connectedAddress } = useAccount();

  const contractName = "ETFLock";

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

  const etfTokenAddress = "0xEbC26af07cbbE8E87b8Fe3A1F5ac02950D3Fa2A8";

  const { isFetching: isFet, refetch: refet } = useContractRead({
    address: etfTokenAddress,
    functionName: "balanceOf",
    abi: contractsData["SimpleERC20"].abi,
    args: [connectedAddress],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      notification.error(parsedErrror);
    },
  });

  const handleWrite = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(collateralAmountFee.toString()) });
        await writeTxn(makeWriteWithParams);
        // onChange();
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };

  // const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  // const { data: txResult } = useWaitForTransaction({
  //   hash: result?.hash,
  // });

  // useEffect(() => {
  //   setDisplayedTxResult(txResult);
  // }, [txResult]);

  useEffect(() => {
    async function fetchData() {
      if (isFet || !connectedAddress) {
        return;
      }
      if (refet) {
        const { data } = await refet();
        setBalance(data);
      }
    }
    fetchData();
  }, [connectedAddress]);

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
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (isVaultFet) {
        return;
      }
      if (vaultSate) {
        const { data } = await vaultSate();
        console.log('vault', data);
        setVault(data);
      }
    }
    fetchData();
  }, [bundleId]);

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          color: "black",
          // centering the card
          margin: "auto",
          width: "1000px",
        }}
        className="card"
      >
        <h1 className="text-4xl my-0">ETF {bundleId}</h1>
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
        {/* {JSON.stringify(vault)} */}
        <br></br>

        <b>ETF Token Balance</b>
        {displayTxResult(balance)}
        <br></br>
        {/* <button className="btn btn-secondary btn-sm" disabled={writeDisabled || isLoading} onClick={handleWrite}>
          {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          Send 💸
        </button>
        {txResult ? (
          <div className="flex-grow basis-0">
            {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
          </div>
        ) : null} */}
        <br></br>
        <br></br>
        <Deposit bundleId={bundleId} />
        <br></br>
        {/* <CollateralVaultView bundleId={bundleId} /> */}
        <br></br>
      </div>
    </>
  );
};

export default ETF;
