import { expect } from "chai";
import { ethers } from "hardhat";
import { HyperlaneMessageSender, HyperlaneMessageReceiver, TestMailBox } from "../typechain-types";

describe("Hyperlane Bridge", function () {
  // We define a fixture to reuse the same setup in every test.

  let sender: HyperlaneMessageSender;
  let receiver: HyperlaneMessageReceiver;
  let mailbox: TestMailBox;
  const domain = 42;

  before(async () => {
    // const [owner] = await ethers.getSigners();
    const mailboxFactory = await ethers.getContractFactory("MockMailbox");
    mailbox = (await mailboxFactory.deploy(domain)) as TestMailBox;
    const mailboxAddress = await mailbox.getAddress();
    const senderFactory = await ethers.getContractFactory("HyperlaneMessageSender");
    const receiverFactory = await ethers.getContractFactory("HyperlaneMessageReceiver");
    sender = (await senderFactory.deploy(mailboxAddress)) as HyperlaneMessageSender;
    receiver = (await receiverFactory.deploy(mailboxAddress)) as HyperlaneMessageReceiver;
    expect(await sender.getAddress).to.be.not.null;
    expect(await receiver.getAddress).to.be.not.null;
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      // check if it was deployed with the right message
    });

    it("Should allow setting a new message", async function () {});
  });
});
