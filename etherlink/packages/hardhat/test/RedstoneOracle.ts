import { ethers } from "hardhat";
// import { Contract } from "@ethersproject/contracts";
// import * as RAPI_ARTIFACTS from "../deployments/etherlink/RapidExample.json";

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
  // let contractOralcle: Contract;

  before(async () => {
    // const [owner] = await ethers.getSigners();
    const rapidContractFactory = await ethers.getContractFactory("RapidExample");
    const rapid = await rapidContractFactory.deploy();
    console.log("Rapid deployed to:", await rapid.getAddress());
    // contractOralcle = new Contract(await rapid.getAddress(), RAPI_ARTIFACTS.abi);
  });

  describe("Deployment", function () {
    it("Should have the right price feed", async function () {
      // await contractOralcle.deployed();
    });
  });
});
