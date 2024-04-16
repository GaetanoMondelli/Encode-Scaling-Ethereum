import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { SimpleERC20, ETFLock } from "../typechain-types";
import * as CORE_DEPLOYMENT from "../../../../bridge/artifacts/core-deployment-2024-04-11-01-28-34.json";
import * as RECEIVER_DEPLOYMENT from "../deployments/sepolia/HyperlaneMessageReceiver.json";
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
  const etherlinkChainId = 128123;
  const sepoliaChainId = 11155111;
  const decimalFactor = BigNumber.from(10).pow(18);
  const tokenPerVault = BigNumber.from(100).mul(decimalFactor).toString();
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const sepoliaMailBoxAddress = CORE_DEPLOYMENT["sepolia"]["mailbox"];
  const sepoliaISMAddress = CORE_DEPLOYMENT["sepolia"]["messageIdMultisigIsm"];

  if (hre.network.name === "sepolia") {
    const requiredSideTokens = [
      {
        _address: "",
        _quantity: BigNumber.from(100).mul(decimalFactor).toString(),
        _chainId: sepoliaChainId,
        _contributor: deployer,
        // ZERP ADDRESS
        _aggregator: zeroAddress,
      },
    ];

    for (let i = 0; i < requiredSideTokens.length; i++) {
      await deploy("SimpleERC20", {
        from: deployer,
        args: ["SIDEToken" + i, "SIDETK" + i, 0],
        log: true,
      });

      const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
      // await t.mint(deployer, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
      requiredSideTokens[i]._address = await t.getAddress();
    }

    console.log("Required side tokens: ", requiredSideTokens);
    await deploy("ETFLock", {
      from: deployer,
      args: [etherlinkChainId, sepoliaChainId, requiredSideTokens, zeroAddress, tokenPerVault],
      log: true,
    });

    const etfSide = await hre.ethers.getContract<ETFLock>("ETFLock", deployer);

    // await requiredSideTokens.map(async token => {
    const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
    await t.approve(await etfSide.getAddress(), BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    // });

    // const main ETF contract
    const mainETFAddress = "0x7eBA9F2dAb2d51dA19b962b8AfD5780d8C26c19d";

    // set side chain params
    await etfSide.setSideChainParams(mainETFAddress, sepoliaMailBoxAddress, sepoliaISMAddress);
  }

  if (hre.network.name === "etherlink") {
    console.log("Deploying ETF contract");
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
        args: ["Token" + i, "TK" + i, 0],
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

    await deploy("MockAggregator", {
      from: deployer,
      args: [5, 18],
      log: true,
    });

    const aggregatorForForeignToken = await hre.ethers.getContract<SimpleERC20>("MockAggregator", deployer);

    requiredTokens.push({
      _address: "0xA0ac5c99C36128C1De7F88e4f0894D8859Bbc2B2",
      _quantity: BigNumber.from(100).mul(decimalFactor).toString(),
      _chainId: sepoliaChainId,
      _contributor: deployer,
      _aggregator: await aggregatorForForeignToken.getAddress(),
    });

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
      args: [etherlinkChainId, etherlinkChainId, requiredTokens, await etfToken.getAddress(), tokenPerVault],
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
