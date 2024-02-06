import { ethers } from "hardhat";

async function main() {
  const ITrustCollection = await ethers.getContractFactory("ITrust");
  const iTrustCollection = await ITrustCollection.deploy();

  await iTrustCollection.waitForDeployment();
  const iTrustCollectionAddress = await iTrustCollection.getAddress();

  console.log(`iTrustCollection deployed to ${iTrustCollectionAddress}`);

  const ITrustStake = await ethers.getContractFactory("ITrustStake");
  const iTrustStake = await ITrustStake.deploy(
    "0x036D74e276e4eB5c575f75F7ff38232E4362DBe9",
    "0xa8F5e4d1c612f0d36B7FB3f63F7e864da28d9FfA",
    "0x21d24c7fE8501a0Eea2BBAa6C8aFEC56376a0181"
  );

  await iTrustStake.waitForDeployment();
  const iTrustStakeAddress = await iTrustStake.getAddress();

  console.log(`iTrustStake deployed to ${iTrustStakeAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
