import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { RapidExample } from "../typechain-types";
import { Contract } from "@ethersproject/contracts";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import * as RAPID_ARTIFACTS from "../deployments/etherlink/RapidExample.json";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  if (hre.network.name === "etherlink") {
    console.log("Deploying the Redstone Showroom contract");
    const rapidExample = "RapidExample";
    await deploy(rapidExample, {
      from: deployer,
      log: true,
    });

    const privateKey = "";

    const provider = new JsonRpcProvider("https://node.ghostnet.etherlink.com");
    const wallet = new Wallet(privateKey).connect(provider);
    const contract = new Contract(RAPID_ARTIFACTS.address, RAPID_ARTIFACTS.abi, wallet);

    const wrappedContract = await WrapperBuilder.wrap(contract).usingDataService({
      dataServiceId: "redstone-rapid-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["BTC", "ETH", "BNB", "AR", "AVAX", "CELO"],
    });

    // const exampleRedstoneShowroomAddress = await exampleRedstoneShowroomContract.getAddress();

    console.log("Redstone Showroom contract address: ", await wrappedContract.getLatestEthPrice());
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["redstone"];
