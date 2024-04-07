import { writeFileSync } from "fs";
import { BigNumber } from "@ethersproject/bignumber";

export const preDeployedSNXContractOnMumbai = "0xdE617C9DaDDF41EbD739cA57eBbA607C11ba902d";
export const amountSNX = BigNumber.from(6).mul(BigNumber.from(10).pow(18));

const DEMO_USER_ADDRESS = "0x2a1F5eB3e84e58e6F1e565306298B9dE1273f203";
const DEM0_USER_ADDRESS_2 = "0x001385E75cfc5563a925981F8501916D7Efb4344";

async function main() {
  const accounts = await ethers.getSigners();


  const contracts: any = {};


  

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
