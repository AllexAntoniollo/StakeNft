import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const contract = await Token.deploy();

    return {
      contract,
      owner,
      otherAccount,
    };
  }
  it("Should mint", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(owner.address);

    const balance = await contract.balanceOf(owner.address);

    expect(balance).to.equal(ethers.parseUnits("100", "ether"));
  });
});
