import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HyperlaneMessageSender, HyperlaneMessageReceiver } from "../typechain-types";
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
    const sepoliaMailBoxAddress = "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766";
    const sepoliaISMAddress = "0xa717195377ad63B5EF830548492878ED9A1528D0";

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
    const receiverAddress = "0x872D8748F58656AAF9812D10545056dDCB0E3b36";
    console.log("Deploying the Sender and send a message to the Receiver");
    const etherlinkMailBoxAddress = "0xe052fEBE52ACE3d4F80Eb3d8685Bac93a9504361";
    const etherlinkISMAddress = "0x14BD801cF0FA5d78C9C8579FBeaB1Cc420fA788C";
    const senderName = "HyperlaneMessageSender";
    await deploy(senderName, {
      from: deployer,
      args: [etherlinkMailBoxAddress, etherlinkISMAddress],
      log: true,
    });

    const senderContract = await hre.ethers.getContract<HyperlaneMessageSender>(senderName, deployer);
    const tx = await senderContract.sendStringToAddress(sepoliaChainId, receiverAddress, "Hello GMZ");
    const receipt = await tx.wait();
    console.log("Transaction receipt: ", receipt);
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
