import { ethers } from "hardhat";

async function main() {
  const ERC721a = await ethers.getContractFactory("ITrust");
  const erc721a = await ERC721a.deploy();

  await erc721a.waitForDeployment();
  const marketAddress = await erc721a.getAddress();

  console.log(`erc721a deployed to ${marketAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
