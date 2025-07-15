const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");


describe("SimpleSwap", function () {

    let tokenA;
    let tokenAAddress;
    let tokenB;
    let tokenBAddress;
    let user1;
    let user2;



    beforeEach(async function () {
        
        const [_ownerToken, _user1, _user2] = await hre.ethers.getSigners();
        ownerToken = _ownerToken;
        user1 = _user1;
        user2 = _user2;

        tokenA = await hre.ethers.deployContract("MyTokenA", [ownerToken]);
        tokenAAddress = await tokenA.getAddress();  

        tokenB = await hre.ethers.deployContract("MyTokenB", [ownerToken]);
        tokenBAddress = await tokenB.getAddress();
    });


    it("Mint Token A to user", async function () {
        //set allowance for swapContract
        await tokenA.connect(ownerToken).mint(user1, 10000);
        expect(await tokenA.balanceOf(user1)).to.equal(10000);
    });

    it("Approve Token A to user", async function () {
        //set allowance for swapContract
        await tokenA.connect(ownerToken).mint(user1, 10000);
        expect(await tokenA.balanceOf(user1)).to.equal(10000);

        await tokenA.connect(user1).approve(user2, 500);
        expect(await tokenA.allowance(user1, user2)).to.equal(500);
    });

     it("Pause Token A", async function () {
        //set allowance for swapContract
        await tokenA.connect(ownerToken).pause();
        await expect(tokenA.connect(ownerToken).mint(user1, 10000)).to.be.revertedWithCustomError(tokenA, 'EnforcedPause');
        await tokenA.connect(ownerToken).unpause();
    });

    it("Mint Token B to user", async function () {
        //set allowance for swapContract
        await tokenB.connect(ownerToken).mint(user1, 10000);
        expect(await tokenB.balanceOf(user1)).to.equal(10000);
    });

    it("Approve Token B to user", async function () {
        //set allowance for swapContract
        await tokenB.connect(ownerToken).mint(user1, 10000);
        expect(await tokenB.balanceOf(user1)).to.equal(10000);

        await tokenB.connect(user1).approve(user2, 500);
        expect(await tokenB.allowance(user1, user2)).to.equal(500);
    });

     it("Pause Token B", async function () {
        //set allowance for swapContract
        await tokenB.connect(ownerToken).pause();
        await expect(tokenB.connect(ownerToken).mint(user1, 10000)).to.be.revertedWithCustomError(tokenB, 'EnforcedPause');
        await tokenB.connect(ownerToken).unpause();
    });
});