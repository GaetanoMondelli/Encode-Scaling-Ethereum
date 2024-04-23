// import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";

import { BigNumber } from "@ethersproject/bignumber";
// import REDSTONE_EXAMPLE_ABI from "../externalResources/ShowRoomAbi.json";
import RAPID_ARTIFACTS from "../deployments/etherlink/RapidExample.json";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
export const preDeployedSNXContractOnMumbai = "0xdE617C9DaDDF41EbD739cA57eBbA607C11ba902d";
export const amountSNX = BigNumber.from(6).mul(BigNumber.from(10).pow(18));
// const privateKey = "";

async function main() {
  // const deployedContractAddress = "0xADb76B04aAE2dEc0043b3CFc26A51Cd9bD75164a";
  // const signer = new ethers.JsonRpcSigner(provider, "0x2a1F5eB3e84e58e6F1e565306298B9dE1273f203");
  // const priceFeedAddress = "0x2e441adc345daeb11ff9c2cae7efd461e5525850";
  
  const provider = new JsonRpcProvider("https://node.ghostnet.etherlink.com");
  const contract = new Contract(RAPID_ARTIFACTS.address, RAPID_ARTIFACTS.abi, provider);
  const wrappedContract = await WrapperBuilder.wrap(contract).usingDataService({
    dataServiceId: "redstone-rapid-demo",
    uniqueSignersCount: 1,
    dataFeeds: ["ETH"],
    // dataFeeds: ["BTC", "ETH", "BNB", "AR", "AVAX", "CELO"],
  });
  console.log("Prices: ", await wrappedContract.getLatestEthPrice());

  // const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
  //   dataServiceId: "redstone-rapid-demo",
  //   uniqueSignersCount: 1,
  //   dataFeeds: ["BTC", "ETH", "BNB", "AR", "AVAX", "CELO"],
  // });
  // return await wrappedContract.getPrices();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
