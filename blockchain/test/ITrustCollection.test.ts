import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ITrustCollection", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ITrustCollection = await ethers.getContractFactory("ITrust");
    const contract = await ITrustCollection.deploy();

    return {
      contract,
      owner,
      otherAccount,
    };
  }

  it("Should mint", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);

    const balance = await contract.balanceOf(owner.address);
    const tokenId = 0;
    const ownerOf = await contract.ownerOf(tokenId);
    const totalSupply = await contract.totalSupply();

    expect(balance).to.equal(1, "Can't mint");
    expect(ownerOf).to.equal(owner.address, "Can't mint");
    expect(totalSupply).to.equal(1, "Can't mint");
  });
  it("Should token URI", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    expect(await contract.tokenURI(0)).to.equal(
      "ipfs://teal-causal-salamander-208.mypinata.cloud/0"
    );
  });
});
