const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Token", function () {
  async function deployTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();

    return { token, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("should have minted the owner tokens", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      const balance = await token.balanceOf(owner.address);

      assert.equal(balance.toString(), 1000);
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

    it("it should allow us to do approve/tranferFrom", async () => {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );
      const balanceOwner = await token.balanceOf(owner.address);
      assert.equal(balanceOwner.toString(), 1000);
    });
  });
});
