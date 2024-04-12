import { expect } from "chai";
import { ethers } from "hardhat";
import { RapidExample } from "../typechain-types";
import { SimpleNumericMockWrapper } from "@redstone-finance/evm-connector/dist/src/wrappers/SimpleMockNumericWrapper";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import * as RAPI_ARTIFACTS from "../deployments/etherlink/RapidExample.json";

// const wrappedContract =
//   WrapperBuilder.wrap(yourContract).usingSimpleNumericMock(
//     {
//       mockSignersCount: 10,
//       dataPoints: [
//         {dataFeedId: "ETH", value: 1000}
//       ],
//     },
//   );
//   await wrappedContract.yourMethod();

describe("Hyperlane Bridge", function () {
  // We define a fixture to reuse the same setup in every test.
  let contractOralcle: Contract;

  before(async () => {
    // const [owner] = await ethers.getSigners();
    const rapidContractFactory = await ethers.getContractFactory("RapidExample");
    const rapid = await rapidContractFactory.deploy();

    // const wallet = new Wallet("0x1294695293f333466d699cca83fce35cf2c3dd960fd35a93d44ae548835c9b32").connect(provider);

    contractOralcle = new Contract(await rapid.getAddress(), RAPI_ARTIFACTS.abi, provider);
  });

  describe("Deployment", function () {
    it("Should have the right price feed", async function () {
    //   const wrappedContract = WrapperBuilder.wrap(contractOralcle).usingSimpleNumericMock({
    //     mockSignersCount: 10,
    //     dataPoints: [{ dataFeedId: "ETH", value: 1000 }],
    //   });
      await contractOralcle.version();
    });
  });
});
