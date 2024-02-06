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

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    const addressToken = await token.getAddress();

    const iTrustStake = await ethers.getContractFactory("ITrustStake");
    const ITrustStake = await iTrustStake.deploy(
      addressNFT,
      owner.address,
      addressToken
    );
    const addressStake = await ITrustStake.getAddress();
    await iTrustCollection.mint(99);
    const instance = await iTrustCollection.connect(otherAccount);
    await instance.mint(1);

    return {
      ITrustStake,
      iTrustCollection,
      owner,
      otherAccount,
      addressNFT,
      addressStake,
    };
  }

  it("Should stake", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.approve(ITrustStake.getAddress(), 25);
    await ITrustStake.stake(25);
    const firstBalance = await ITrustStake.balanceOf(owner);
    await iTrustCollection.approve(ITrustStake.getAddress(), 26);
    await ITrustStake.stake(26);

    expect(firstBalance).to.be.equal(3);
    expect(await ITrustStake.balanceOf(owner)).to.be.equal(4);
    expect(await ITrustStake.totalStake()).to.be.equal(2);
  });

  it("Should withdraw", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.approve(ITrustStake.getAddress(), 25);
    await ITrustStake.stake(25);
    await await iTrustCollection.approve(ITrustStake.getAddress(), 26);
    await ITrustStake.stake(26);
    await ITrustStake.withdraw(25);
    const firstBalance = await ITrustStake.balanceOf(owner);
    await ITrustStake.withdraw(26);

    expect(firstBalance).to.be.equal(1);
    expect(await ITrustStake.balanceOf(owner)).to.be.equal(0);
    expect(await ITrustStake.totalStake()).to.be.equal(0);
  });

  it("Should set duration distribution", async function () {
    const { ITrustStake } = await loadFixture(deployFixture);

    const days = 60 * 60 * 24 * 30;
    await ITrustStake.setRewardsDuration(days);
  });

  it("Should not remove stake (Unauthorized)", async function () {
    const { ITrustStake, iTrustCollection, otherAccount } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.approve(ITrustStake.getAddress(), 1);

    await ITrustStake.stake(1);
    const instance = await ITrustStake.connect(otherAccount);

    await expect(instance.withdraw(1)).to.be.revertedWith("Unauthorized");
  });

  it("Should fetch my NFTs", async function () {
    const { ITrustStake, iTrustCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);

    const instanceC = iTrustCollection.connect(otherAccount);
    await instanceC.approve(ITrustStake.getAddress(), 100);
    const instance = ITrustStake.connect(otherAccount);
    await instance.stake(100);

    const myNftsOwner = await ITrustStake.fetchMyNfts();
    const myNftsAccount = await instance.fetchMyNfts();

    expect(myNftsOwner.length).to.equal(1);
    expect(myNftsAccount.length).to.equal(1);
  });

  it("Should fetch my NFTs zero", async function () {
    const { ITrustStake } = await loadFixture(deployFixture);

    const myNfts = await ITrustStake.fetchMyNfts();

    expect(myNfts.length).to.equal(0);
  });
});
