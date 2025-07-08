
const { expect } = require("chai");
const hre = require("hardhat");


describe("SimpleSwap", function () {

    let ownerSwap;
    let swapAddress;
    let tokenA;
    let tokenAAddress;
    let tokenB;
    let tokenBAddress;
    let user1;
    let user2;
    let swapContract;



    beforeEach(async function () {
        
        const [_ownerSwap, _ownerTokenA, _ownerTokenB, _user1, _user2] = await hre.ethers.getSigners();
        ownerSwap = _ownerSwap;
        user1 = _user1;
        user2 = _user2;

        swapContract = await hre.ethers.deployContract("SimpleSwap", [ownerSwap]);
        swapAddress = await swapContract.getAddress();
        console.log("Swap contract address:", swapAddress);

        tokenA = await hre.ethers.deployContract("MyTokenA", [_ownerTokenA]);
        tokenAAddress = await tokenA.getAddress();  
        console.log("TokenA address:", tokenAAddress);
        await tokenA.connect(_ownerTokenA).mint(user1, 20000);
        expect(await tokenA.balanceOf(user1)).to.equal(20000);
        await tokenA.connect(_ownerTokenA).mint(user2, 5000);
        expect(await tokenA.balanceOf(user2)).to.equal(5000);
    

        tokenB = await hre.ethers.deployContract("MyTokenB", [_ownerTokenB]);
        tokenBAddress = await tokenB.getAddress();  
        console.log("TokenB address:", tokenBAddress);
        await tokenB.connect(_ownerTokenB).mint(user1, 30000);
        expect(await tokenB.balanceOf(user1)).to.equal(30000);
        await tokenB.connect(_ownerTokenB).mint(user2, 3000);
        expect(await tokenB.balanceOf(user2)).to.equal(3000);
    });


    it("Setear liquidez al contrato", async function () {
        //set allowance for swapContract
       
        await tokenA.connect(user1).approve(swapAddress, 10000);
        expect(await tokenA.allowance(user1, swapAddress)).to.equal(10000);
        await tokenB.connect(user1).approve(swapAddress, 15000);
        expect(await tokenB.allowance(user1, swapAddress)).to.equal(15000);
        await swapContract.connect(user1).addLiquidity(tokenAAddress, tokenBAddress, 10000, 15000, 1000, 1000, user1.address, 200);
        let balanceLiquidity = await swapContract.balanceOf(user1.address);
        console.log("Liquidity tokens :", balanceLiquidity.toString());
        expect(balanceLiquidity).to.gt(0);
    });
});