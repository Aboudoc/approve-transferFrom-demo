const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  async function deployTokenFixture() {
    const [owner, otherAccount, attacker] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    const Protocol = await ethers.getContractFactory("Protocol");
    const protocol = await Protocol.deploy();
    const Attack = await ethers.getContractFactory("Attack");
    const attack = await Attack.deploy(token.address);

    return { token, owner, otherAccount, attacker, attack, protocol };
  }

  describe("Deployment", function () {
    it("should have minted the owner tokens", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      const balance = await token.balanceOf(owner.address);

      assert.equal(balance.toString(), 1000);
      // assert(balance.eq(1000));
      // assert(balance.gt(0));
    });

    it("should allow us to send tokens", async () => {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      await token.transfer(otherAccount.address, 999);

      const balanceOwner = await token.balanceOf(owner.address);
      const balanceOther = await token.balanceOf(otherAccount.address);

      assert.equal(balanceOwner.toString(), 1);
      assert.equal(balanceOther.toString(), 999);
    });

    it("should allow us to send tokens to the protocol", async () => {
      const { token, protocol, owner } = await loadFixture(deployTokenFixture);

      await token.approve(protocol.address, 1000);
      await protocol.deposit(token.address, 400);

      const balanceOwner = await token.balanceOf(owner.address);
      const balanceProto = await token.balanceOf(protocol.address);
      const balanceInProtocol = await protocol.balances(owner.address);

      assert.equal(balanceProto.toString(), 400);
      assert.equal(balanceOwner.toString(), 600);
      assert.equal(balanceInProtocol.toString(), 400);
    });
  });

  describe("attack", function () {
    it("it should have sent tokens to the victim", async () => {
      const { token, otherAccount } = await loadFixture(deployTokenFixture);
      await token.transfer(otherAccount.address, 666);
      const otherBalance = await token.balanceOf(otherAccount.address);
      assert.equal(otherBalance.toString(), 666);
    });

    it("should drain victim's wallet", async () => {
      const { token, owner, otherAccount, attack } = await loadFixture(
        deployTokenFixture
      );

      await token.transfer(otherAccount.address, 666);
      const balanceVictimBefore = await token.balanceOf(otherAccount.address);
      const balanceOwnerBefore = await token.balanceOf(owner.address);

      await attack.connect(otherAccount).exploit();

      const balanceVictimAfter = await token.balanceOf(otherAccount.address);
      const balanceOwnerAfter = await token.balanceOf(owner.address);

      assert.equal(balanceVictimBefore.toString(), 666);
      assert.equal(balanceVictimAfter.toString(), 0);
      assert.equal(balanceOwnerBefore.toString(), 334);
      assert.equal(balanceOwnerAfter.toString(), 1000);
    });
  });
});
