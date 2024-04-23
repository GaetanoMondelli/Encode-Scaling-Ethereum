import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { SimpleERC20, ETFLock, Quasar } from "../typechain-types";
import * as CORE_DEPLOYMENT from "../../../../bridge/artifacts/core-deployment-2024-04-11-01-28-34.json";
import { BigNumber } from "@ethersproject/bignumber";
const delay = 3000;
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
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
    await sleep(delay);
    const t = await hre.ethers.getContractAt("SimpleERC20", "0xA0ac5c99C36128C1De7F88e4f0894D8859Bbc2B2");
    await sleep(delay);
    await t.mint(deployer, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    requiredSideTokens[0]._address = "0xA0ac5c99C36128C1De7F88e4f0894D8859Bbc2B2";

    // console.log("Required side tokens: ", requiredSideTokens);
    await sleep(delay);
    await deploy("ETFLock", {
      from: deployer,
      args: [etherlinkChainId, sepoliaChainId, requiredSideTokens, zeroAddress, tokenPerVault],
      log: true,
    });
    await sleep(delay);
    const etfSide = await hre.ethers.getContract<ETFLock>("ETFLock", deployer);

    await sleep(delay);
    t.approve(await etfSide.getAddress(), BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());

    // // // await requiredSideTokens.map(async token => {
    // const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
    // await t.approve(await etfSide.getAddress(), BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    // });

    // // const main ETF contract
    const mainETFAddress = "0x0F077B8750838830309F93fa7f746f440DbF7690";

    // // set side chain params
    await etfSide.setSideChainParams(mainETFAddress, sepoliaMailBoxAddress, sepoliaISMAddress);
  }

  if (hre.network.name === "presto") {
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

    console.log("Deploying custom Quasar contract");
    await sleep(delay);
    await deploy("Quasar", {
      from: deployer,
      log: true,
    });

    for (let i = 0; i < requiredTokens.length; i++) {
      await sleep(delay);
      await deploy("SimpleERC20", {
        from: deployer,
        args: ["Token" + i, "TK" + i, BigNumber.from(2000).mul(decimalFactor).toString()],
        log: true,
      });
      await sleep(delay);
      const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
      requiredTokens[i]._address = await t.getAddress();
      // get the Quasar contract at the address
      const quasar = await hre.ethers.getContract<Quasar>("Quasar", deployer);
      console.log("Next Id: ", await quasar.getNextID());
      await quasar.addCurrency("Token" + i, "TK" + i);
      console.log("Token address: ", requiredTokens[i]._address);
      requiredTokens[i]._aggregator = await quasar.getAddress();
    }
    const quasar = await hre.ethers.getContract<Quasar>("Quasar", deployer);

    await sleep(delay);
    await quasar.addCurrency("SIDEToken0", "SIDETK0");
    requiredTokens.push({
      _address: "0xA0ac5c99C36128C1De7F88e4f0894D8859Bbc2B2",
      _quantity: BigNumber.from(100).mul(decimalFactor).toString(),
      _chainId: sepoliaChainId,
      _contributor: deployer,
      _aggregator: await quasar.getAddress(),
    });

    // console.log("Required tokens: ", requiredTokens);

    // deploy etfToken contract
    await sleep(delay);
    await deploy("SimpleERC20", {
      from: deployer,
      args: ["ETFToken", "ETF", 0],
      log: true,
    });
    const etfToken = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
    console.log("ETF Token address: ", await etfToken.getAddress());
    await sleep(delay);
    await deploy("ETFLock", {
      from: deployer,
      args: [etherlinkChainId, etherlinkChainId, requiredTokens, await etfToken.getAddress(), tokenPerVault],
      log: true,
    });
    const etf = await hre.ethers.getContract<ETFLock>("ETFLock", deployer);
    await sleep(delay);
    await etfToken.setOwner(await etf.getAddress());

    // await etf.setMainChainParams(
    //   "0x0d808c694f5b916343D2139181599CA545d72B0e",
    //   sepoliaChainId,
    //   CORE_DEPLOYMENT["etherlink"]["mailbox"],
    //   CORE_DEPLOYMENT["etherlink"]["messageIdMultisigIsm"],
    // );
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["etf"];
