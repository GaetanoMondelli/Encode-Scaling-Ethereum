import { expect } from "chai";
import { ethers } from "hardhat";
import { ETFLock } from "../typechain-types";
import { BigNumber } from "@ethersproject/bignumber";

describe("Hyperlane Bridge", function () {
  // We define a fixture to reuse the same setup in every test.

  let etf: ETFLock;
  const domain = 42;
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  before(async () => {
    // const [owner] = await ethers.getSigners();
    const etfLockFactory = await ethers.getContractFactory("ETFLock");

    const requiredTokens = [
      {
        _address: zeroAddress,
        _quantity: BigNumber.from(10).pow(18).toString(),
        _chainId: domain,
        _contributor: zeroAddress,
      },
    ];

    etf = (await etfLockFactory.deploy(domain, requiredTokens)) as ETFLock;
  });

  it("Should have deployed the etf lock", async function () {
    const etfAddress = await etf.getAddress();
    expect(await etfAddress).to.be.not.null;
  });
});
