import {
  loadFixture,
  setBalance,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ITrustStake", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const ITrustCollection = await ethers.getContractFactory("ITrust");
    const iTrustCollection = await ITrustCollection.deploy();
    const addressNFT = await iTrustCollection.getAddress();

    const iTrustStake = await ethers.getContractFactory("ITrustStake");
    const ITrustStake = await iTrustStake.deploy(addressNFT, owner.address);
    const addressStake = await ITrustStake.getAddress();

    return {
      ITrustStake,
      iTrustCollection,
      owner,
      otherAccount,
      addressNFT,
      addressStake,
    };
  }

  it("Should not remove stake (Unauthorized)", async function () {
    const { ITrustStake, iTrustCollection, otherAccount } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.mint(1);

    await iTrustCollection.approve(ITrustStake.getAddress(), 1);

    await ITrustStake.stake(1);
    const instance = await ITrustStake.connect(otherAccount);

    await expect(instance.withdraw(1)).to.be.revertedWith("Unauthorized");
  });

  it("Should fetch my NFTs", async function () {
    const { ITrustStake, iTrustCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    await iTrustCollection.mint(2);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);

    const instanceC = iTrustCollection.connect(otherAccount);
    await instanceC.mint(1);
    await instanceC.approve(ITrustStake.getAddress(), 3);
    const instance = ITrustStake.connect(otherAccount);
    await instance.stake(3);

    const myNftsOwner = await ITrustStake.fetchMyNfts();
    const myNftsAccount = await instance.fetchMyNfts();

    expect(myNftsOwner.length).to.equal(1);
    expect(myNftsAccount.length).to.equal(1);
  });

  it("Should fetch my NFTs zero", async function () {
    const { ITrustStake, iTrustCollection, otherAccount } = await loadFixture(
      deployFixture
    );

    const myNfts = await ITrustStake.fetchMyNfts();

    expect(myNfts.length).to.equal(0);
  });
});
