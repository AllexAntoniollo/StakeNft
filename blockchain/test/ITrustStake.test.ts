import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ITrustStake", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ITrustCollection = await ethers.getContractFactory("ITrust");
    const iTrustCollection = await ITrustCollection.deploy();
    const addressNFT = iTrustCollection.getAddress();

    const iTrustStake = await ethers.getContractFactory("ITrustStake");
    const ITrustStake = await iTrustStake.deploy(addressNFT, owner.address);

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

  it("Should pay automated", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.mint(1);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);
    await owner.sendTransaction({
      to: ITrustStake.getAddress(),
      value: ethers.parseUnits("1", "ether"),
    });
    await ITrustStake.payStakeAutomated();

    expect(await ITrustStake.poolBNB()).to.equal(0);
  });

  it("Should pay manual", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );

    await iTrustCollection.mint(1);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);
    await owner.sendTransaction({
      to: ITrustStake.getAddress(),
      value: ethers.parseUnits("1", "ether"),
    });
    const days = 10 * 24 * 60 * 60 * 1000;
    const timestampAtual = Math.floor(Date.now());

    const timestampNoFuturo = timestampAtual + days;

    await ITrustStake.payStakeManual(
      timestampNoFuturo,
      ethers.parseUnits("0.6", "ether")
    );

    expect(await ITrustStake.poolBNB()).to.equal(
      ethers.parseUnits("0.4", "ether")
    );
  });

  it("Should harvest manual", async function () {
    const { ITrustStake, iTrustCollection, owner, otherAccount } =
      await loadFixture(deployFixture);

    await iTrustCollection.mint(1);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);
    await otherAccount.sendTransaction({
      to: ITrustStake.getAddress(),
      value: ethers.parseUnits("1", "ether"),
    });
    const days = 10 * 24 * 60 * 60 * 1000;
    const timestampAtual = Math.floor(Date.now());

    const timestampNoFuturo = timestampAtual + days;

    await ITrustStake.payStakeManual(
      timestampNoFuturo,
      ethers.parseUnits("0.6", "ether")
    );

    await time.increase(11 * 24 * 60 * 60);
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

    await ITrustStake.harvest(1);
    const myNfts = await ITrustStake.fetchMyNfts();
    console.log(myNfts);
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    expect(ownerBalanceAfter).to.be.closeTo(
      ownerBalanceBefore + ethers.parseUnits("0.6", "ether"),
      ethers.parseUnits("0.01", "ether")
    );
  });

  it("Should harvest", async function () {
    const { ITrustStake, iTrustCollection, owner, otherAccount } =
      await loadFixture(deployFixture);

    await iTrustCollection.mint(1);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);

    await otherAccount.sendTransaction({
      to: ITrustStake.getAddress(),
      value: ethers.parseUnits("1", "ether"),
    });
    await ITrustStake.payStakeAutomated();
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    await ITrustStake.harvest(1);
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    const contractBalance = await ethers.provider.getBalance(
      ITrustStake.getAddress()
    );

    expect(ownerBalanceAfter).to.be.closeTo(
      ownerBalanceBefore + ethers.parseUnits("1", "ether"),
      ethers.parseUnits("0.01", "ether")
    );

    expect(contractBalance).to.equal(0);
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

  it("Should not harvest (Unauthorized)", async function () {
    const { ITrustStake, iTrustCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    await iTrustCollection.mint(1);
    await iTrustCollection.approve(ITrustStake.getAddress(), 1);
    await ITrustStake.stake(1);
    await otherAccount.sendTransaction({
      to: ITrustStake.getAddress(),
      value: ethers.parseUnits("1", "ether"),
    });
    await ITrustStake.payStakeAutomated();
    const instance = ITrustStake.connect(otherAccount);
    await expect(instance.harvest(1)).to.be.revertedWith("Unauthorized");
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
