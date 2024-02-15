import { ethers } from "hardhat";

async function main() {
  /*
  const ITrustCollection = await ethers.getContractFactory("ITrustCollection");
  const iTrustCollection = await ITrustCollection.deploy();

  await iTrustCollection.waitForDeployment();
  const iTrustCollectionAddress = await iTrustCollection.getAddress();

  console.log(`iTrustCollection deployed to ${iTrustCollectionAddress}`);

  const ITrustStake = await ethers.getContractFactory("ITrustStake");
  const iTrustStake = await ITrustStake.deploy(
    iTrustCollectionAddress,
    "0xa8F5e4d1c612f0d36B7FB3f63F7e864da28d9FfA",
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
  );

  await iTrustStake.waitForDeployment();
  const iTrustStakeAddress = await iTrustStake.getAddress();

  console.log(`iTrustStake deployed to ${iTrustStakeAddress}`);*/
  const Streaming = await ethers.getContractFactory("StreamingiTrust");
  const streaming = await Streaming.deploy(
    "0xBc9E7C67B127405194cB556B3D9DE39cA8AE07Cb",
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
  );

  await streaming.waitForDeployment();
  const streamingAddress = await streaming.getAddress();

  console.log(`streaming deployed to ${streamingAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
