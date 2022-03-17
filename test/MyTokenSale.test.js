const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");

const chai = require("./setupChai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({ path: "../.env" });

contract("TokenSale Test", async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  it("should not have any tokens in my deployerAccount", async () => {
    let instance = await Token.deployed();

    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it("all tokens should be in the TokenSale Smart Contract by default", async () => {
    let instance = await Token.deployed();
    let balanceOfTokenSaleSmartContract = await instance.balanceOf(
      TokenSale.address
    );

    let totalSupply = await instance.totlaSupply();

    return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(
      totalSupply
    );
  });

  it("should be possible to buy tokens", async () => {
    let tokenInstance = await Token.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
    expect(
      tokenSaleInstance.sendTransaction({
        from: deployerAccount,
        value: web3.utils.toWei("1", "wei"),
      })
    );
    return expect(
      tokenInstance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
  });
});
