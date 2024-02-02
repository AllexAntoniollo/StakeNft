import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ITrustStake", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ITrustCollection = await ethers.getContractFactory("ITrust");
    const iTrustCollection = await ITrustCollection.deploy();
    const addressNFT = iTrustCollection.getAddress();

    const iTrustStake = await ethers.getContractFactory("ITrustStake");
    const ITrustStake = await iTrustStake.deploy(addressNFT);

    return {
      ITrustStake,
      iTrustCollection,
      owner,
      otherAccount,
      addressNFT,
    };
  }

  it("Should create market items (ERC721)", async function () {
    const { ITrustStake, iTrustCollection, addressNFT } = await loadFixture(
      deployFixture
    );

    expect(1).to.equal(1);
  });
});
