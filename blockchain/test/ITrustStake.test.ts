import {
  loadFixture,
  setBalance,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("ITrustStake", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const decimals = 10 ** 8;
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

    await token.mint(addressStake);

    return {
      ITrustStake,
      iTrustCollection,
      token,
      owner,
      otherAccount,
      addressNFT,
      addressStake,
      decimals,
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

  it("Should set Distribution", async function () {
    const { ITrustStake, iTrustCollection, otherAccount, decimals } =
      await loadFixture(deployFixture);

    const days = 60 * 60 * 24 * 10;
    var dataAtual = new Date();

    var novaData = new Date(dataAtual.getTime() + days * 1000);
    var novaDataEmSegundos = Math.floor(novaData.getTime() / 1000);
    const instanceNft = await iTrustCollection.connect(otherAccount);

    const instance = await ITrustStake.connect(otherAccount);

    await instanceNft.mint(2);
    await instanceNft.approve(ITrustStake.getAddress(), 1);
    await instance.stake(1);
    await instanceNft.approve(ITrustStake.getAddress(), 2);
    await instance.stake(2);
    await ITrustStake.setTokenDistribution(days, 100);

    const finishPeriod = await ITrustStake.finishPeriod();
    const tokensMinute = await ITrustStake.tokensPerMinute();
    const totalEligible = await ITrustStake.totalStakeEligible();
    const poolAmount = await ITrustStake.poolAmount();

    expect(poolAmount).to.be.equal(100 * decimals);
    expect(tokensMinute).to.be.equal(Math.round((100 * decimals) / 14400));

    expect(finishPeriod).to.be.closeTo(novaDataEmSegundos, 30);
    expect(totalEligible).to.be.equal(2);
  });

  it("Should pay stake", async function () {
    const {
      ITrustStake,
      iTrustCollection,
      token,
      otherAccount,
      decimals,
      addressStake,
    } = await loadFixture(deployFixture);

    const days = 60 * 60 * 24 * 10;
    const instanceNft = await iTrustCollection.connect(otherAccount);

    const instance = await ITrustStake.connect(otherAccount);

    await instanceNft.mint(2);
    await instanceNft.approve(ITrustStake.getAddress(), 1);
    await instance.stake(1);
    await instanceNft.approve(ITrustStake.getAddress(), 2);
    await instance.stake(2);

    await ITrustStake.setTokenDistribution(days, 100);

    time.increase(60 * 60 * 24 * 5);

    await instance.payStake(1);
    const balanceContract = await token.balanceOf(addressStake);
    const balanceUser = await token.balanceOf(otherAccount.address);

    time.increase(60 * 60 * 24);
    await instance.payStake(1);
    const balanceContract2 = await token.balanceOf(addressStake);
    const balanceUser2 = await token.balanceOf(otherAccount.address);

    await instance.withdraw(2);
    const totalEligible = await ITrustStake.totalStakeEligible();

    const balanceContract3 = await ITrustStake.poolAmount();
    const balanceUser3 = await token.balanceOf(otherAccount.address);

    expect(balanceContract).to.be.equal(
      ethers.parseUnits("75.000016", "ether")
    );
    expect(balanceUser).to.be.equal(ethers.parseUnits("24.999984", "ether"));
    console.log(balanceUser2);

    /*expect(balanceUser2).to.be.equal(ethers.parseUnits("29.9999808", "ether"));
    
    expect(balanceContract2).to.be.equal(
      ethers.parseUnits("70.0000192", "ether")
    );
    
    expect(balanceUser3).to.be.equal(ethers.parseUnits("59.9999616", "ether"));
*/
    expect(balanceContract3).to.be.equal(70.0000192 * decimals);

    expect(totalEligible).to.be.equal(1);
  });

  it("Should pay stake withdraw", async function () {
    const { ITrustStake, iTrustCollection, token, otherAccount, decimals } =
      await loadFixture(deployFixture);

    const days = 60 * 60 * 24 * 10;
    const instanceNft = await iTrustCollection.connect(otherAccount);

    const instance = await ITrustStake.connect(otherAccount);

    await instanceNft.mint(4);
    await instanceNft.approve(ITrustStake.getAddress(), 1);
    await instance.stake(1);
    await instanceNft.approve(ITrustStake.getAddress(), 2);
    await instance.stake(2);

    await ITrustStake.setTokenDistribution(days, 100);

    time.increase(60 * 60 * 24 * 5);
    await instanceNft.approve(ITrustStake.getAddress(), 3);
    await instance.stake(3);
    await instance.withdraw(1);
    await instanceNft.approve(ITrustStake.getAddress(), 4);
    await instance.stake(4);
    const balanceContract = await ITrustStake.poolAmount();
    const balanceUser = await token.balanceOf(otherAccount.address);
    time.increase(60 * 60 * 24 * 6);

    await instance.payStake(2);
    const balanceContract2 = await ITrustStake.poolAmount();
    const balanceUser2 = await token.balanceOf(otherAccount.address);

    expect(balanceContract).to.be.equal(
      Math.round((100 - 24.999984) * decimals)
    );
    await expect(instance.payStake(1)).to.be.revertedWith(
      "You are not eligible"
    );

    expect(balanceUser).to.be.equal(ethers.parseUnits("24.999984", "ether"));
    expect(balanceUser2).to.be.equal(ethers.parseUnits("99.999936", "ether"));
    expect(balanceContract2).to.be.equal(
      Math.round((100 - 24.999984) * decimals)
    );
  });

  it("Should not set Distribution (Only 1)", async function () {
    const { ITrustStake, iTrustCollection, owner } = await loadFixture(
      deployFixture
    );

    const days = 60 * 60 * 24 * 10;

    await ITrustStake.setTokenDistribution(days, 100);

    await expect(
      ITrustStake.setTokenDistribution(days, 100)
    ).to.be.revertedWith("Only 1 distribution for time");
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
