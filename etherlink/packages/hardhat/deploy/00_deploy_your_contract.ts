import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HyperlaneMessageSender, HyperlaneMessageReceiver } from "../typechain-types";
import * as CORE_DEPLOYMENT from "../../../../bridge/artifacts/core-deployment-2024-04-11-00-36-10.json";
import * as RECEIVER_DEPLOYMENT from "../deployments/sepolia/HyperlaneMessageReceiver.json";
// import { BigNumber } from "@ethersproject/bignumber";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const sepoliaChainId = 11155111;
  // const etherlinkChainId = 128123;

  if (hre.network.name === "sepolia") {
    console.log("Deploying the Receiver and receive a message from the Sender");
    const sepoliaMailBoxAddress = CORE_DEPLOYMENT["sepolia"]["mailbox"];
    const sepoliaISMAddress = CORE_DEPLOYMENT["sepolia"]["messageIdMultisigIsm"];

    const receiverName = "HyperlaneMessageReceiver";
    await deploy(receiverName, {
      from: deployer,
      args: [sepoliaMailBoxAddress, sepoliaISMAddress],
      log: true,
    });
    const receiverContract = await hre.ethers.getContract<HyperlaneMessageReceiver>(receiverName, deployer);
    // console log the address of the deployed contract
    console.log("Receiver contract address: ", await receiverContract.getAddress());

    const lastMessage = await receiverContract.lastMessage();
    console.log("Last message: ", lastMessage);
  }

  if (hre.network.name === "etherlink") {
    const receiverAddress = RECEIVER_DEPLOYMENT["address"];

    console.log("Deploying the Sender and send a message to the Receiver");
    const etherlinkMailBoxAddress = CORE_DEPLOYMENT["etherlink"]["mailbox"];
    const etherlinkISMAddress = CORE_DEPLOYMENT["etherlink"]["messageIdMultisigIsm"];
    const senderName = "HyperlaneMessageSender";
    await deploy(senderName, {
      from: deployer,
      args: [etherlinkMailBoxAddress, etherlinkISMAddress],
      log: true,
    });

    const senderContract = await hre.ethers.getContract<HyperlaneMessageSender>(senderName, deployer);
    const tx = await senderContract.sendStringToAddress(sepoliaChainId, receiverAddress, "Ciao from London Again!0:10");
    const receipt = await tx.wait();
    console.log("Transaction receipt: ", receipt);
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
