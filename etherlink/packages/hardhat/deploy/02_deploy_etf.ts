import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { SimpleERC20, ETFLock } from "../typechain-types";
// import * as CORE_DEPLOYMENT from "../../../../bridge/artifacts/core-deployment-2024-04-11-01-28-34.json";
// import * as RECEIVER_DEPLOYMENT from "../deployments/sepolia/HyperlaneMessageReceiver.json";
import { BigNumber } from "@ethersproject/bignumber";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  // const sepoliaChainId = 11155111;
  const etherlinkChainId = 128123;
  const decimalFactor = BigNumber.from(10).pow(18);
  const tokenPerVault = BigNumber.from(100).mul(decimalFactor).toString();

  // if (hre.network.name === "sepolia") {
  //   console.log("Deploying the Receiver and receive a message from the Sender");
  //   const sepoliaMailBoxAddress = CORE_DEPLOYMENT["sepolia"]["mailbox"];
  //   const sepoliaISMAddress = CORE_DEPLOYMENT["sepolia"]["messageIdMultisigIsm"];

  //   const receiverName = "HyperlaneMessageReceiver";
  //   await deploy(receiverName, {
  //     from: deployer,
  //     args: [sepoliaMailBoxAddress, sepoliaISMAddress],
  //     log: true,
  //   });
  //   const receiverContract = await hre.ethers.getContract<HyperlaneMessageReceiver>(receiverName, deployer);
  //   // console log the address of the deployed contract
  //   console.log("Receiver contract address: ", await receiverContract.getAddress());

  //   const lastMessage = await receiverContract.lastMessage();
  //   console.log("Last message: ", lastMessage);
  // }
  console.log("Deploying ETF contract");
  if (hre.network.name === "etherlink") {
    //deploy tokenA and tokenB contracts
    const requiredTokens = [
      {
        _address: "",
        _quantity: BigNumber.from(100).mul(decimalFactor).toString(),
        _chainId: etherlinkChainId,
        _contributor: deployer,
        _aggregator: "",
      },
      {
        _address: "",
        _quantity: BigNumber.from(200).mul(decimalFactor).toString(),
        _chainId: etherlinkChainId,
        _contributor: deployer,
        _aggregator: "",
      },
    ];

    for (let i = 0; i < requiredTokens.length; i++) {
      await deploy("SimpleERC20", {
        from: deployer,
        args: ["Token" + i, "TK" + i, 18],
        log: true,
      });
      await deploy("MockAggregator", {
        from: deployer,
        args: [10 * i, 18],
        log: true,
      });
      const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
      await t.mint(deployer, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
      requiredTokens[i]._address = await t.getAddress();
      requiredTokens[i]._aggregator = await (await hre.ethers.getContract("MockAggregator", deployer)).getAddress();
    }

    // console.log("Required tokens: ", requiredTokens);

    // deploy etfToken contract
    await deploy("SimpleERC20", {
      from: deployer,
      args: ["ETFToken", "ETF", 0],
      log: true,
    });
    const etfToken = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
    console.log("ETF Token address: ", await etfToken.getAddress());

    await deploy("ETFLock", {
      from: deployer,
      args: [etherlinkChainId, requiredTokens, await etfToken.getAddress(), tokenPerVault],
      log: true,
    });
    const etf = await hre.ethers.getContract<ETFLock>("ETFLock", deployer);
    await etfToken.setOwner(await etf.getAddress());
    requiredTokens.map(async token => {
      const t = await hre.ethers.getContract<SimpleERC20>(token._address, deployer);
      await t.approve(await etf.getAddress(), BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    });
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["etf"];
