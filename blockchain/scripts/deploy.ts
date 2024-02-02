import { ethers } from "hardhat";

async function main() {
  const ITrustCollection = await ethers.getContractFactory("ITrust");
  const iTrustCollection = await ITrustCollection.deploy();

  await iTrustCollection.waitForDeployment();
  const iTrustCollectionAddress = await iTrustCollection.getAddress();

  console.log(`iTrustCollection deployed to ${iTrustCollectionAddress}`);

  const ITrustStake = await ethers.getContractFactory("ITrustStake");
  const iTrustStake = await ITrustStake.deploy(iTrustCollectionAddress);

  await iTrustStake.waitForDeployment();
  const iTrustStakeAddress = await iTrustStake.getAddress();

  console.log(`iTrustStake deployed to ${iTrustStakeAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
