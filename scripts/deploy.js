const path = require('path')
const Utils = require('../Utils');
const { ethers, getNamedAccounts, getChainId, deployments } = require("hardhat");
const { deploy } = deployments;

// const { deploy1820 } = require('deploy-eip-1820');
const chalk = require('chalk');
const fs = require('fs');

const uniswapRouterABI = require("../artifacts/contracts/interfaces/IUniswapRouter.sol/IUniswapV2Router02.json").abi;
const bep20ABI = require("../artifacts/contracts/libs/IBEP20.sol/IBEP20.json").abi;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));


function dim() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.dim.call(chalk, ...arguments));
  }
}

function cyan() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.cyan.call(chalk, ...arguments));
  }
}

function yellow() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.yellow.call(chalk, ...arguments));
  }
}

function green() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.green.call(chalk, ...arguments));
  }
}

function displayResult(name, result) {
  if (!result.newlyDeployed) {
    yellow(`Re-used existing ${name} at ${result.address}`);
  } else {
    green(`${name} deployed at ${result.address}`);
  }
}

const chainName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 42:
      return 'Kovan';
    case 56:
      return 'Binance Smart Chain';
    case 77:
      return 'POA Sokol';
    case 97:
      return 'Binance Smart Chain (testnet)';
    case 99:
      return 'POA';
    case 100:
      return 'xDai';
    case 137:
      return 'Matic';
    case 1337:
        return 'HardhatEVM';
    case 31337:
      return 'HardhatEVM';
    case 80001:
      return 'Matic (Mumbai)';
    default:
      return 'Unknown';
  }
};

async function main() {

    const { getContractFactory, getSigners } = ethers;
    // let { anotherUser } = await getNamedAccounts();
    let [owner, userWallet, anotherUser] = await getSigners();

    const chainId = parseInt(await getChainId(), 10);
    const upgrades = hre.upgrades;

    dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    dim('Smart Ecosystem Contracts - Deploy Script');
    dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');

    dim(`Network: ${chainName(chainId)}`);

    if(chainId !== 97 && chainId !== 1337){
        console.log(">>>>>>>>>>> unsupported blockchain >>>>>>>>>>>>>>");
        return;
    }

    console.log("owner:", owner.address);
    console.log("user:", userWallet.address);
    console.log("another user:", anotherUser.address);
    console.log("chain id:", chainId);

    const options = {
      deploySmartComp: true,
      upgradeSmartComp: false,
      
      deployGoldenTreePool: true,
      upgradeGoldenTreePool: false,

      deploySmartAchievement: true,
      upgradeSmartAchievement: false,

      deploySmartArmy: true,
      upgradeSmartArmy: false,

      deploySmartFarm: true,
      upgradeSmartFarm: false,

      deploySmartLadder: true,
      upgradeSmartLadder: false,

      deploySMTBridge: true,

      deploySMTToken: true,

      testSMTTokenTransfer: false,

      testAddLiquidity: true,
      
      testSwap: true
    }

    ///////////////////////// BUSD Token ///////////////////////////
    cyan(`\nDeploying BUSD Contract...`);
    let deployedBusd = await deploy('BEP20Token', {
      from: owner.address,
      skipIfAlreadyDeployed: true
    });
    displayResult('BUSD contract', deployedBusd);

    ///////////////////////// SmartTokenCash ///////////////////////
    cyan(`\nDeploying SMTC Contract...`);
    let deployedSMTC = await deploy('SmartTokenCash', {
      from: owner.address,
      skipIfAlreadyDeployed: true
    });
    displayResult('SmartTokenCash contract', deployedSMTC);
    
    ///////////////////////// SmartComp ///////////////////////
    let smartCompAddress = "0x5109c8E2f83298aAF0fb2D250173Df4d6dD70543";
    const SmartComp = await ethers.getContractFactory('SmartComp');
    if(options.deploySmartComp) {
      cyan("Deploying SmartComp contract");
      let SmartCompContract = await upgrades.deployProxy(
        SmartComp, [],
        { initializer: 'initialize', kind: 'uups' }
      );
      await SmartCompContract.deployed();
      smartCompAddress = SmartCompContract.address;
      displayResult('SmartTokenCash contract', SmartCompContract);
    }
    if(options.upgradeSmartComp) {
      green("Upgrading SmartComp contract");
      await upgrades.upgradeProxy(smartCompAddress, SmartComp);      
      green(`SmartComp Contract Upgraded`);
    }
    if(!options.deploySmartComp && !options.upgradeSmartComp){
      green(`\nSmartComp Contract deployed at ${smartCompAddress}`);
    }

    ///////////////////////// SMTBridge ///////////////////////
    let smartCompInstance = await ethers.getContractAt("SmartComp", smartCompAddress);
    let smtBridgeAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    
    if(options.deploySMTBridge) {
      console.log(smtBridgeAddress);
      console.log(deployedBusd.address);
      let tx = await smartCompInstance.setBUSD(deployedBusd.address);
      console.log(tx.hash);
      await tx.wait();
      // console.log(IERC20(uniswapV2Router.WETH()));
      let wbnb = await smartCompInstance.getWBNB();
      console.log("wbnb:", wbnb);
      let busd = await smartCompInstance.getBUSD();
      let uniswapV2Factory = await smartCompInstance.getUniswapV2Factory();
      console.log("wbnb:", wbnb);
      console.log("busd:", busd);
      console.log("uniswapV2Factory:", uniswapV2Factory);
    
      cyan(`\nDeploying SMTBridge Contract...`);
      let deployedSMTBridge = await deploy('SMTBridge', {
        from: owner.address,
        args: [wbnb, uniswapV2Factory],
        skipIfAlreadyDeployed: true
      });
      displayResult('SMTBridge contract', deployedSMTBridge);  
    } else {
      green(`\SMTBridge Contract deployed at ${smtBridgeAddress}`);
    }

    ///////////////////////// Golden Tree Pool //////////////////// 
    let goldenTreePoolAddress = '0xDAC575ddcdD2Ff269EE5C30420C96028Ba7cB304';
    const GoldenTreePool = await ethers.getContractFactory('GoldenTreePool');
    if(options.deployGoldenTreePool) {
        cyan(`\nDeploying GoldenTreePool contract...`);
        const GoldenTreePoolContract = await upgrades.deployProxy(
            GoldenTreePool,
            [smartCompAddress, deployedSMTC.address],
            {
              initializer: 'initialize',
              kind: 'uups'
            }
        );
        await GoldenTreePoolContract.deployed();
        
        goldenTreePoolAddress = GoldenTreePoolContract.address;
        displayResult('GoldenTreePool Contract Address:', GoldenTreePoolContract);
        let goldenTreePoolInstance = await ethers.getContractAt("GoldenTreePool", goldenTreePoolAddress);
        // SetGoldenTreePool on Comptroller
        const updatingGoldenTreePoolTx = await smartCompInstance.setGoldenTreePool(goldenTreePoolAddress);
        await updatingGoldenTreePoolTx.wait();
    }
    if(options.upgradeGoldenTreePool) {
        green(`\nUpgrading GoldenTreePool contract...`);
        await upgrades.upgradeProxy(goldenTreePoolAddress, GoldenTreePool);
        green(`GoldenTreePool Contract Upgraded`);
    }
    if(!options.deployGoldenTreePool && 
      !options.upgradeGoldenTreePool) {
      green(`\nGoldenTreePool Contract deployed at ${goldenTreePoolAddress}`);
    }

    ///////////////// Smart Archievement ////////////////////
    let smartAchievementAddress = '0x828987A77f7145494bD86780349B204F32DB494A';
    const SmartAchievement = await ethers.getContractFactory('SmartAchievement');

    if(options.deploySmartAchievement) {
        cyan(`\nDeploying Smart Achievement contract...`);
        const SmartAchievementContract = await upgrades.deployProxy(SmartAchievement, 
            [smartCompAddress, deployedSMTC.address],
            {initializer: 'initialize',kind: 'uups'}
        );    
        await SmartAchievementContract.deployed()        
        smartAchievementAddress = SmartAchievementContract.address;
        displayResult('SmartAchievement Contract Address:', SmartAchievementContract);

        let smartAchievementInstance = await ethers.getContractAt("SmartAchievement", smartAchievementAddress);

        // setSmartAchievement on Comptroller
        const updatingSmartAchievementTx = await smartCompInstance.setSmartAchievement(smartAchievementAddress);
        await updatingSmartAchievementTx.wait();
    }
    if(options.upgradeSmartAchievement) {
        green(`\nUpgrading SmartAchievement contract...`);
        await upgrades.upgradeProxy(smartAchievementAddress, SmartAchievement);
        green(`\nSmartAchievement Contract Upgraded`);
    }
    if(!options.deploySmartAchievement && 
      !options.upgradeSmartAchievement) {
      green(`\nSmartAchievement Contract deployed at ${smartAchievementAddress}`);
    }

    ///////////////// Smart Army //////////////////////
    let smartArmyAddress = '0x86E07ab6b97ADcd7897D960B0c61DFE5CEaD2E76';
    const SmartArmy = await ethers.getContractFactory('SmartArmy');

    if(options.deploySmartArmy) {
        cyan(`\nDeploying SmartArmy contract...`);
        const SmartArmyContract = await upgrades.deployProxy(SmartArmy, 
            [smartCompAddress],
            {initializer: 'initialize',kind: 'uups'}
        );    
        await SmartArmyContract.deployed()        
        smartArmyAddress = SmartArmyContract.address;
        displayResult('SmartArmy Contract Address:', SmartArmyContract);

        let smartArmyInstance = await ethers.getContractAt("SmartArmy", smartArmyAddress)

        // setSmartAchievement on Comptroller
        const updatingSmartArmyTx = await smartCompInstance.setSmartArmy(smartArmyAddress);
        await updatingSmartArmyTx.wait()
    }
    if(options.upgradeSmartArmy) {
        green(`\nUpgrading SmartArmy contract...`);
        await upgrades.upgradeProxy(smartArmyAddress, SmartArmy);
        green(`SmartArmy Contract Upgraded`);
    }
    if(!options.deploySmartArmy && !options.upgradeSmartArmy) {
      green(`\nSmartArmy Contract deployed at ${smartArmyAddress}`);
    }

    ///////////////////// Smart Farm ////////////////////////
    let smartFarmAddress = '0xb654476d77d59259fF1e7fF38B8c4d408639b844';
    const SmartFarm = await ethers.getContractFactory('SmartFarm');
    if(options.deploySmartFarm) {
        cyan(`\nDeploying SmartFarm contract...`);
        const SmartFarmContract = await upgrades.deployProxy(SmartFarm, 
            [smartCompAddress, owner.address],
            {initializer: 'initialize',kind: 'uups'}
        );    
        await SmartFarmContract.deployed()        
        smartFarmAddress = SmartFarmContract.address;
        displayResult('SmartFarm Contract Address:', SmartFarmContract);

        let smartFarmInstance = await ethers.getContractAt("SmartFarm", smartFarmAddress)

        // setSmartFarm on Comptroller
        const updatingSmartFarmTx = await smartCompInstance.setSmartFarm(smartFarmAddress);
        await updatingSmartFarmTx.wait()
    }
    if(options.upgradeSmartFarm) {
        green(`\nUpgrading SmartFarm contract...`);
        await upgrades.upgradeProxy(smartFarmAddress, SmartFarm);
        green(`SmartFarm Contract Upgraded`);
    }
    if(!options.deploySmartFarm && !options.upgradeSmartFarm) {
      green(`\nSmartFarm Contract deployed at ${smartFarmAddress}`);
    }

    ///////////////////////// Smart Ladder ///////////////////////////
    let smartLadderAddress = '0xB5D0D6855EE08eb07eC4Ca51061c93D644367a1e';
    const SmartLadder = await ethers.getContractFactory('SmartLadder');

    if(options.deploySmartLadder) {
        cyan(`\nDeploying SmartLadder contract...`);
        const SmartLadderContract = await upgrades.deployProxy(SmartLadder, 
            [smartCompAddress, owner.address],
            {initializer: 'initialize',kind: 'uups'}
        );    
        await SmartLadderContract.deployed()
        
        smartLadderAddress = SmartLadderContract.address;
        displayResult('SmartLadder Contract Address:', SmartLadderContract);
        let smartLadderInstance = await ethers.getContractAt("SmartLadder", smartLadderAddress)

        // setSmartFarm on Comptroller
        const updatingSmartLadderTx = await smartCompInstance.setSmartLadder(smartLadderAddress);
        await updatingSmartLadderTx.wait()
    }
    if(options.upgradeSmartLadder) {
        green(`\nUpgrading SmartLadder contract...`);
        await upgrades.upgradeProxy(smartLadderAddress, SmartLadder);
        green(`SmartLadder Contract Upgraded`);
    }
    if(!options.deploySmartLadder && !options.upgradeSmartLadder) {
        green(`\nSmartLadder Contract deployed at ${smartLadderAddress}`);
    }

    ////////////////////// Smart Token ////////////////////////
    let stmcTokenAddress = "0x95AbeF217ea1e11300eEcf97585e6C6a66D04d15";
    if(options.deploySMTToken) {
      let busd = await smartCompInstance.getBUSD();
      console.log("busd address: ", busd);
      cyan(`\nDeploying SMT Token...`);
      let deployedSmtc = await deploy('SmartToken', {
        from: owner.address,
        args: [
            busd,
            smartLadderAddress,
            goldenTreePoolAddress,
            owner.address,
            smartAchievementAddress,
            smartFarmAddress,
            smtBridgeAddress,
            smartArmyAddress,
            smartCompInstance.address,
            owner.address
        ],
        skipIfAlreadyDeployed: false
      });
      displayResult('SMT Token Address:', deployedSmtc);
      stmcTokenAddress = deployedSmtc.address;
      let smartTokenInstance = await ethers.getContractAt("SmartToken", stmcTokenAddress);
      let totalSupply = await smartTokenInstance.totalSupply();
      let balance = await smartTokenInstance.balanceOf(owner.address);
      console.log("token name: ", await smartTokenInstance.name());
      console.log("token symbol: ", await smartTokenInstance.symbol());
      console.log("total supply: ", ethers.utils.formatEther(totalSupply.toString()));
      console.log(`the balance of ${owner.address}:`, ethers.utils.formatEther(balance.toString()));

      // setSMT on Comptroller
      let tx = await smartCompInstance.setSMT(deployedSmtc.address);
      await tx.wait();
      console.log("smartCompInstance.setSMT Tx:", tx.hash);
  
      // Add rewards distributor
      let smartAchievementInstance = await ethers.getContractAt("SmartAchievement", smartAchievementAddress);
      tx = await smartAchievementInstance.addDistributor(deployedSmtc.address);
      await tx.wait();
      console.log("smartAchievementInstance.addDistributor Tx:", tx.hash);
  
      let smartFarmInstance = await ethers.getContractAt("SmartFarm", smartFarmAddress);
      tx = await smartFarmInstance.addDistributor(deployedSmtc.address);
      await tx.wait();
      console.log("smartFarmInstance.addDistributor Tx:", tx.hash);  

    } else {
      green(`\nSmart Token deployed at ${stmcTokenAddress}`);      
    }

    if(options.testSMTTokenTransfer) {
      let smartTokenInstance = await ethers.getContractAt("SmartToken", stmcTokenAddress);
      // const tranferTx =  await smartTokenInstance.transfer(anotherUser.address, ethers.utils.parseUnits("100000", 18));
      // await tranferTx.wait();
      // console.log("owner -> another user transfer tx:", tranferTx.hash);
  
      tranferTx =  await smartTokenInstance.connect(anotherUser).transfer(
        userWallet.address, 
        ethers.utils.parseUnits("1000", 18)
      );
      await tranferTx.wait();
      console.log("another user -> user transfer tx:", tranferTx.hash);
  
      let balance = await smartTokenInstance.balanceOf(anotherUser.address);
      console.log("another user balance:",
                  ethers.utils.formatEther(balance.toString()));
      balance = await smartTokenInstance.balanceOf(userWallet.address);
      console.log("user balance:",
                  ethers.utils.formatEther(balance.toString()));
    }

    const contractSmtBnbLP = "0x44E34B530992109c624684e6371fC23e4E1C2C94";
    const contractSmtBusdLP = "0x1C19f2269E633DaA608D00AEfA449fe0E0DC44ee";

    let smartTokenInstance = await ethers.getContractAt("SmartToken", stmcTokenAddress);
    const busdAddr = await smartCompInstance.getBUSD();
    let busdToken = new ethers.Contract(busdAddr, bep20ABI, owner);

    let routerInstance = new ethers.Contract(
      smartCompInstance.getUniswapV2Router(), uniswapRouterABI, owner
    );

    if(options.testAddLiquidity) {

      let pairSmtcBnbAddr = await smartTokenInstance._uniswapV2ETHPair();
      console.log("SMT-BNB LP token address: ", pairSmtcBnbAddr);
      let pairSmtcBusdAddr = await smartTokenInstance._uniswapV2BUSDPair();
      console.log("SMT-BUSD LP token address: ", pairSmtcBusdAddr);
      let pairSmtcBnbIns = new ethers.Contract(pairSmtcBnbAddr, bep20ABI, owner);
      let pairSmtcBusdIns = new ethers.Contract(pairSmtcBusdAddr, bep20ABI, owner);

      ///////////////////  SMT-BNB Add Liquidity /////////////////////
      let tx = await smartTokenInstance.approve(
        routerInstance.address,
        ethers.utils.parseUnits("22000",18)
      );
      await tx.wait();

      tx = await routerInstance.addLiquidityETH(
        stmcTokenAddress,
        ethers.utils.parseUnits("10000", 18),
        0,
        0,
        owner.address,
        "111111111111111111111",
        {value : ethers.utils.parseUnits("0.25", 18)}
      );
      await tx.wait();
      console.log("SMT-BNB add liquidity tx: ", tx.hash);
      
      let balanceStmcBnb = await pairSmtcBnbIns.balanceOf(owner.address);
      console.log("SMT-BNB balance: ", ethers.utils.formatEther(balanceStmcBnb));

      ///////////////////  SMT-BUSD Add Liquidity /////////////////////

			tx = await busdToken.approve(
				routerInstance.address,
				ethers.utils.parseUnits("10000", 18)
			);
			await tx.wait();
      let balance = await smartTokenInstance.balanceOf(owner.address);
      console.log("owner balance:", ethers.utils.formatEther(balance.toString()));
			tx = await routerInstance.addLiquidity(
				stmcTokenAddress,
				busdAddr,
				ethers.utils.parseUnits("1000", 18),
				ethers.utils.parseUnits("1000", 18),
				0,
				0,
				owner.address,
				"111111111111111111111"
			);
			await tx.wait();
      console.log("SMT-BUSD add liquidity tx: ", tx.hash);

      let balanceStmcBusd = await pairSmtcBusdIns.balanceOf(owner.address);
      console.log("SMT-BUSD balance: ", ethers.utils.formatEther(balanceStmcBusd));    
    }

    if(options.testSwap) {
      /////////////////////////////  SMT --> BNB Swapping ////////////////////////////////
      let balance = await smartTokenInstance.balanceOf(owner.address);
      console.log("SMT token balance: ", ethers.utils.formatEther(balance));    
      balance = await ethers.provider.getBalance(owner.address);
      console.log("BNB token balance: ", ethers.utils.formatEther(balance));

      let tx = await smartTokenInstance.approve(
          routerInstance.address,
          ethers.utils.parseUnits("1000", 18)
      );
      await tx.wait();
      let swapAmount = ethers.utils.parseUnits("500", 18);
      let amountsOut = await routerInstance.getAmountsOut(
        swapAmount,
        [
          await smartCompInstance.getSMT(), 
          await routerInstance.WETH()
        ]
      );
      console.log("excepted swap balance: ", ethers.utils.formatEther(amountsOut[1]));

      tx = await routerInstance.swapExactTokensForETHSupportingFeeOnTransferTokens(
        swapAmount, 0,
        [
          await smartCompInstance.getSMT(), 
          await routerInstance.WETH()
        ],
        owner.address,
        "99000000000000000"
      );
      await tx.wait();
      console.log("swapped tx: ", tx.hash);
      balance = await smartTokenInstance.balanceOf(owner.address);
      console.log("SMT token balance: ", ethers.utils.formatEther(balance));    
      balance = await ethers.provider.getBalance(owner.address);
      console.log("BNB token balance: ", ethers.utils.formatEther(balance));
      cyan("\n==============================================\n");
      /////////////////////////////  SMT --> BUSD Swapping ////////////////////////////////
      balance = await smartTokenInstance.balanceOf(owner.address);
      console.log("SMT token balance: ", ethers.utils.formatEther(balance));    
      balance = await busdToken.balanceOf(owner.address);
      console.log("BUSD token balance: ", ethers.utils.formatEther(balance));

      tx = await smartTokenInstance.approve(
          routerInstance.address,
          ethers.utils.parseUnits("1000", 18)
      );
      await tx.wait();
      swapAmount = ethers.utils.parseUnits("200", 18);
      amountsOut = await routerInstance.getAmountsOut(
        swapAmount,
        [
          await smartCompInstance.getSMT(), 
          await smartCompInstance.getBUSD()
        ]
      );
      console.log("excepted swap balance: ", ethers.utils.formatEther(amountsOut[1]));
      tx = await routerInstance.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        swapAmount,
        0,
        [
          await smartCompInstance.getSMT(),
          await smartCompInstance.getBUSD()
        ],
        owner.address,
        "99000000000000000"
      );
      await tx.wait();
      console.log("swapped tx: ", tx.hash);
      balance = await smartTokenInstance.balanceOf(owner.address);
      console.log("SMT token balance: ", ethers.utils.formatEther(balance));    
      balance = await busdToken.balanceOf(owner.address);
      console.log("BUSD token balance: ", ethers.utils.formatEther(balance));
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
