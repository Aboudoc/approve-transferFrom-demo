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
    it("Should set the right unlockTime", async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );
      const balance = await token.balanceOf(owner.address);

      assert.equal(balance.toString(), 1000);
    });
  });
});
