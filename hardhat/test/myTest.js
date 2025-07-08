
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


    it("Agregar liquidez al contrato", async function () {
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

    it("Remover liquidez al contrato", async function () {
        //set allowance for swapContract
        await tokenA.connect(user1).approve(swapAddress, 10000);
        expect(await tokenA.allowance(user1, swapAddress)).to.equal(10000);
        await tokenB.connect(user1).approve(swapAddress, 15000);
        expect(await tokenB.allowance(user1, swapAddress)).to.equal(15000);
        const amountA = 10000;
        const amountB = 15000;
        console.log("Adding liquidity A:", amountA , "B:", amountB);
        await swapContract.connect(user1).addLiquidity(tokenAAddress, tokenBAddress, amountA, amountB, 1000, 1000, user1.address, 200);

        let balanceLiquidity = await swapContract.balanceOf(user1.address);
        console.log("Liquidity tokens :", balanceLiquidity.toString());
        expect(balanceLiquidity).to.gt(0);

        const lastBalanceA = await tokenA.balanceOf(user1.address);
        console.log("Last Balance A:",lastBalanceA.toString());

        const lastBalanceB = await tokenB.balanceOf(user1.address);
        console.log("Last Balance B:",lastBalanceB.toString());

        await swapContract.connect(user1).removeLiquidity(tokenAAddress, tokenBAddress, balanceLiquidity, 1, 1, user1.address, 200);

        const newBalanceA = await tokenA.balanceOf(user1.address);
        console.log("New Balance A:",newBalanceA.toString());
        expect(newBalanceA).to.equal(lastBalanceA + BigInt(amountA));

        const newBalanceB = await tokenB.balanceOf(user1.address);
        console.log("New Balance B:",newBalanceB.toString());
        expect(newBalanceB).to.equal(lastBalanceB + BigInt(amountB));
    });

    it("Swap token A x B", async function () {
        //set allowance for swapContract
        await tokenA.connect(user1).approve(swapAddress, 10000);
        expect(await tokenA.allowance(user1, swapAddress)).to.equal(10000);
        await tokenB.connect(user1).approve(swapAddress, 15000);
        expect(await tokenB.allowance(user1, swapAddress)).to.equal(15000);
        await swapContract.connect(user1).addLiquidity(tokenAAddress, tokenBAddress, 10000, 15000, 1000, 1000, user1.address, 200);

        const reserveA = await await tokenA.balanceOf(swapAddress);
        console.log("Reserve A:", reserveA.toString());
        const reserveB = await await tokenB.balanceOf(swapAddress);
        console.log("Reserve B:", reserveB.toString());
        const amountOut = await swapContract.getAmountOut(1000, reserveA, reserveB);
        console.log("Amount out for 1000 A:", amountOut.toString());
        await tokenA.connect(user1).approve(swapAddress, 1000);
        const amountABalance = await tokenA.balanceOf(user1.address);
        console.log("User1 Balance A before swap:", amountABalance.toString());
        const amountBBalance = await tokenB.balanceOf(user1.address);
        console.log("User1 Balance B before swap:", amountBBalance.toString());

        await swapContract.connect(user1).swapExactTokensForTokens(1000, amountOut, [tokenAAddress, tokenBAddress], user1.address, 200);
        const newAmountABalance = await tokenA.balanceOf(user1.address);
        console.log("User1 Balance A after swap:", newAmountABalance.toString());
        expect(newAmountABalance).to.equal(amountABalance - 1000n);
        const newAmountBBalance = await tokenB.balanceOf(user1.address);
        console.log("User1 Balance B after swap:", newAmountBBalance.toString());
        expect(newAmountBBalance).to.equal(amountBBalance + BigInt(amountOut));
    });

    it("Swap token B x A", async function () {
        //set allowance for swapContract
        await tokenA.connect(user1).approve(swapAddress, 10000);
        expect(await tokenA.allowance(user1, swapAddress)).to.equal(10000);
        await tokenB.connect(user1).approve(swapAddress, 15000);
        expect(await tokenB.allowance(user1, swapAddress)).to.equal(15000);
        await swapContract.connect(user1).addLiquidity(tokenAAddress, tokenBAddress, 10000, 15000, 1000, 1000, user1.address, 200);

        const reserveA = await await tokenA.balanceOf(swapAddress);
        console.log("Reserve A:", reserveA.toString());
        const reserveB = await await tokenB.balanceOf(swapAddress);
        console.log("Reserve B:", reserveB.toString());
        const amountOut = await swapContract.getAmountOut(1000, reserveB, reserveA);
        console.log("Amount out for 1000 B:", amountOut.toString());
        await tokenB.connect(user1).approve(swapAddress, 1000);
        const amountBBalance = await tokenB.balanceOf(user1.address);
        console.log("User1 Balance B before swap:", amountBBalance.toString());
        const amountABalance = await tokenA.balanceOf(user1.address);
        console.log("User1 Balance A before swap:", amountABalance.toString());

        await swapContract.connect(user1).swapExactTokensForTokens(1000, amountOut, [tokenBAddress, tokenAAddress], user1.address, 200);
        const newAmountBBalance = await tokenB.balanceOf(user1.address);
        console.log("User1 Balance B after swap:", newAmountBBalance.toString());
        expect(newAmountBBalance).to.equal(amountBBalance - 1000n);
        const newAmountABalance = await tokenA.balanceOf(user1.address);
        console.log("User1 Balance A after swap:", newAmountABalance.toString());
        expect(newAmountABalance).to.equal(amountABalance + BigInt(amountOut));
    });


});