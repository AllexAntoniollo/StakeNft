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

  it("Should stake", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.mint(2);
    const balanceBefore = await iTrustCollection.balanceOf(owner.address);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);

    await ITrustStake.stake(1);
    const balanceAfter = await iTrustCollection.balanceOf(owner.address);

    expect(await ITrustStake.totalStake()).to.equal(1);
    expect(balanceAfter).to.equal(balanceBefore - ethers.toBigInt(1));
  });

  it("Should remove stake", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.mint(2);
    const balanceBefore = await iTrustCollection.balanceOf(owner.address);

    await iTrustCollection.approve(ITrustStake.getAddress(), 1);

    await ITrustStake.stake(1);
    await ITrustStake.withdraw(1);
    const balanceAfter = await iTrustCollection.balanceOf(owner.address);

    expect(balanceAfter).to.equal(balanceBefore);
    expect(await ITrustStake.totalStake()).to.equal(0);
  });

  it("Should fetch All NFTs", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );
    await iTrustCollection.mint(3);
    await iTrustCollection.approve(ITrustStake.getAddress(), 2);
    await ITrustStake.stake(2);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);

    const createdItems = await ITrustStake.fetchAllNfts();

    expect(createdItems.length).to.equal(2);
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
    await instanceC.approve(ITrustStake.getAddress(), 2);
    const instance = ITrustStake.connect(otherAccount);
    await instance.stake(2);

    const allNfts = await ITrustStake.fetchAllNfts();
    const myNftsOwner = await ITrustStake.fetchMyNfts();
    const myNftsAccount = await instance.fetchMyNfts();

    expect(myNftsOwner.length).to.equal(1);
    expect(myNftsAccount.length).to.equal(1);
    expect(allNfts.length).to.equal(2);
  });
  it("Should fetch my NFTs zero", async function () {
    const { ITrustStake, iTrustCollection, otherAccount } = await loadFixture(
      deployFixture
    );

    const myNfts = await ITrustStake.fetchMyNfts();

    expect(myNfts.length).to.equal(0);
  });
});
