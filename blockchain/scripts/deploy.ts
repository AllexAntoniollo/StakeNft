import { ethers } from "hardhat";

async function main() {
  /*const ITrustCollection = await ethers.getContractFactory("ITrust");
  const iTrustCollection = await ITrustCollection.deploy();

  await iTrustCollection.waitForDeployment();
  const iTrustCollectionAddress = await iTrustCollection.getAddress();

  console.log(`iTrustCollection deployed to ${iTrustCollectionAddress}`);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
*/
  const ITrustStake = await ethers.getContractFactory("ITrustStake");
  const iTrustStake = await ITrustStake.deploy(
    "0x2Dc0940fda6173d86fa70E5b2D1779f7FA8e489b",
    "0xa8F5e4d1c612f0d36B7FB3f63F7e864da28d9FfA",
    "0x387A78854dEDA9176990c3610d9Dc5d04E146289"
  );

  await iTrustStake.waitForDeployment();
  const iTrustStakeAddress = await iTrustStake.getAddress();

  console.log(`iTrustStake deployed to ${iTrustStakeAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
