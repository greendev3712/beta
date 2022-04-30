const path = require('path');
const Utils = require('../Utils');
const {
  ethers,
  getNamedAccounts,
  getChainId,
  deployments
} = require('hardhat');
const { deploy } = deployments;
const { expect } = require('chai');

// const { deploy1820 } = require('deploy-eip-1820');
const chalk = require('chalk');
const fs = require('fs');

const uniswapRouterABI =
  require('../artifacts/contracts/interfaces/IUniswapRouter.sol/IUniswapV2Router02.json').abi;
const uniswapPairABI =
  require('../artifacts/contracts/libs/dexfactory.sol/IPancakeSwapPair.json').abi;

const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay * 1000));

let owner, userWallet, anotherUser;
let smtContract, SmartLadderContract;

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

const displayWalletBalances = async (tokenIns, bOwner, bAnother, bUser) => {
  if (bOwner) {
    let balance = await tokenIns.balanceOf(owner.address);
    console.log('owner balance:', ethers.utils.formatEther(balance.toString()));
  }

  if (bAnother) {
    let balance = await tokenIns.balanceOf(anotherUser.address);
    console.log(
      'another user balance:',
      ethers.utils.formatEther(balance.toString())
    );
  }

  if (bUser) {
    let balance = await tokenIns.balanceOf(userWallet.address);
    console.log('user balance:', ethers.utils.formatEther(balance.toString()));
  }
};

const displayLiquidityPoolBalance = async (comment, poolInstance) => {
  let reservesPair = await poolInstance.getReserves();
  console.log(comment);
  console.log('token0:', ethers.utils.formatEther(reservesPair.reserve0));
  console.log('token1:', ethers.utils.formatEther(reservesPair.reserve1));
};

const displayUserInfo = async (farmContract, wallet) => {
  let info = await farmContract.userInfoOf(wallet.address);
  cyan('-------------------------------------------');
  console.log('balance of wallet:', ethers.utils.formatEther(info.balance));
  console.log('rewards of wallet:', info.rewards.toString());
  console.log(
    'reward per token paid of wallet:',
    info.rewardPerTokenPaid.toString()
  );
  console.log('last updated time of wallet:', info.balance.toString());
};

const addLiquidityToPools = async (
  tokenA,
  tokenB,
  routerInstance,
  walletIns,
  smtAmount1,
  bnbAmount,
  smtAmount2,
  busdAmount
) => {
  ///////////////////  SMT-BNB Add Liquidity /////////////////////

  tx = await tokenA
    .connect(walletIns)
    .approve(
      routerInstance.address,
      ethers.utils.parseUnits(Number(smtAmount1 + 100).toString(), 18)
    );
  await tx.wait();

  console.log('approve tx: ', tx.hash);

  tx = await routerInstance
    .connect(walletIns)
    .addLiquidityETH(
      tokenA.address,
      ethers.utils.parseUnits(Number(smtAmount1).toString(), 18),
      0,
      0,
      walletIns.address,
      '111111111111111111111',
      { value: ethers.utils.parseUnits(Number(bnbAmount).toString(), 18) }
    );
  await tx.wait();
  console.log('SMT-BNB add liquidity tx: ', tx.hash);

  ///////////////////  SMT-BUSD Add Liquidity /////////////////////

  tx = await tokenA
    .connect(walletIns)
    .approve(
      routerInstance.address,
      ethers.utils.parseUnits(Number(smtAmount2 + 100).toString(), 18)
    );
  await tx.wait();

  tx = await tokenB
    .connect(walletIns)
    .approve(
      routerInstance.address,
      ethers.utils.parseUnits(Number(busdAmount + 100).toString(), 18)
    );
  await tx.wait();

  tx = await routerInstance
    .connect(walletIns)
    .addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseUnits(Number(smtAmount2).toString(), 18),
      ethers.utils.parseUnits(Number(busdAmount).toString(), 18),
      0,
      0,
      walletIns.address,
      '111111111111111111111'
    );
  await tx.wait();
  console.log('SMT-BUSD add liquidity tx: ', tx.hash);
};

const displayAllLicense = async (smartArmyContract) => {
  cyan('============= Created Licenses =============');
  let count = await smartArmyContract.countOfLicenses();
  cyan(`total license count: ${count}`);
  let defaultLics = await smartArmyContract.fetchAllLicenses();
  for (let i = 0; i < defaultLics.length; i++) {
    console.log('************ index', i, ' **************');
    console.log('level:', defaultLics[i].level.toString());
    console.log('name:', defaultLics[i].name.toString());
    console.log(
      'price:',
      ethers.utils.formatEther(defaultLics[i].price.toString())
    );
    console.log('ladderLevel:', defaultLics[i].ladderLevel.toString());
    console.log('duration:', defaultLics[i].duration.toString());
  }
};

const buyLicense = async (smtTokenIns, smartArmyContract, wallet) => {
  cyan('============= Register Licenses =============');
  let userBalance = await smtTokenIns.balanceOf(wallet.address);
  userBalance = ethers.utils.formatEther(userBalance);

  const license = await smartArmyContract.licenseTypeOf(1);
  let price = ethers.utils.formatEther(license.price);

  if (userBalance < price) {
    console.log('charge SMT token to your wallet!!!!');
    return;
  }

  let licId = await smartArmyContract.licenseIdOf(wallet.address);
  if (licId == 0) {
    let tx = await smartArmyContract
      .connect(wallet)
      .registerLicense(
        1,
        wallet.address,
        'Arsenii',
        'https://t.me.Ivan',
        'https://ipfs/2314341dwer242'
      );
    await tx.wait();
    console.log('License register transaction:', tx.hash);
  } else {
    cyan(`Current user with license ${licId} was registered`);
    displayLicenseOf(smartArmyContract, wallet.address);
  }

  let balance = await smtTokenIns.balanceOf(wallet.address);
  expect(parseInt(ethers.utils.formatEther(balance))).to.greaterThan(0);

  let tx = await smtTokenIns
    .connect(wallet)
    .approve(
      smartArmyContract.address,
      ethers.utils.parseUnits(Number(price).toString(), 18)
    );
  await tx.wait();
  console.log('Activation approved transaction: ', tx.hash);

  tx = await smartArmyContract.connect(wallet).activateLicense();
  await tx.wait();
  console.log('License Activate transaction: ', tx.hash);
};

const displayLicenseOf = async (smartArmyContract, userAddress) => {
  let userLic = await smartArmyContract.licenseOf(userAddress);
  console.log('----------- user license ---------------');
  console.log('owner: ', userLic.owner);
  console.log('level: ', userLic.level.toString());
  console.log('start at: ', userLic.startAt.toString());
  console.log('active at: ', userLic.activeAt.toString());
  console.log('expire at: ', userLic.expireAt.toString());
  console.log(
    'lp locked: ',
    ethers.utils.formatEther(userLic.lpLocked.toString())
  );
  console.log('status: ', userLic.status);
};

async function main() {
  const { getNamedAccounts } = hre;
  const { getContractFactory, getSigners } = ethers;

  let {
    NA_Router,
    NA_SmartComp,
    NA_SmartBridge,
    NA_GoldenTreePool,
    NA_SmartAchievement,
    NA_SmartArmy,
    NA_SmartFarm,
    NA_SmartLadder,
    NA_Busd,
    NA_SMT,
    TestAccount
  } = await getNamedAccounts();

  console.log('router: ', NA_Router);

  [owner, userWallet, anotherUser] = await getSigners();

  const chainId = parseInt(await getChainId(), 10);
  const upgrades = hre.upgrades;

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  dim('Smart Ecosystem Contracts - Deploy Script');
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');

  dim(`Network: ${chainName(chainId)}`);

  // if(chainId !== 97 && chainId !== 1337){
  //     console.log(">>>>>>>>>>> unsupported blockchain >>>>>>>>>>>>>>");
  //     return;
  // }

  console.log('owner:', owner.address);
  console.log('user:', userWallet.address);
  console.log('another user:', anotherUser.address);
  console.log('chain id:', chainId);

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

    resetSmartComp: false,

    deploySMTToken: true,

    testSMTTokenTransfer: true,

    testAddLiquidity: true,

    testArmyLicense: true,

    testSwap: false,

    testFarm: false
  };

  ///////////////////////// BUSD Token ///////////////////////////
  cyan(`\nDeploying BUSD Contract...`);
  let deployedBusd = await deploy('BEP20Token', {
    from: owner.address,
    skipIfAlreadyDeployed: true
  });
  displayResult('BUSD contract', deployedBusd);
  let busdToken = await ethers.getContractAt(
    'BEP20Token',
    deployedBusd.address
  );

  ///////////////////////// SmartTokenCash ///////////////////////
  cyan(`\nDeploying SMTC Contract...`);
  let deployedSMTC = await deploy('SmartTokenCash', {
    from: owner.address,
    skipIfAlreadyDeployed: true
  });
  displayResult('SmartTokenCash contract', deployedSMTC);

  ///////////////////////// SmartComp ///////////////////////
  let smartCompAddress = NA_SmartComp;
  const SmartComp = await ethers.getContractFactory('SmartComp');
  if (options.deploySmartComp) {
    cyan('Deploying SmartComp contract');
    SmartCompContract = await upgrades.deployProxy(
      SmartComp,
      [NA_Router, deployedBusd.address],
      { initializer: 'initialize', kind: 'uups' }
    );
    await SmartCompContract.deployed();
    smartCompAddress = SmartCompContract.address;
    displayResult('SmartComp contract', SmartCompContract);
  }
  if (options.upgradeSmartComp) {
    green('Upgrading SmartComp contract');
    await upgrades.upgradeProxy(smartCompAddress, SmartComp);
    green(`SmartComp Contract Upgraded`);
  }
  if (!options.deploySmartComp && !options.upgradeSmartComp) {
    green(`\nSmartComp Contract deployed at ${smartCompAddress}`);
  }
  const smartCompInstance = await ethers.getContractAt(
    'SmartComp',
    smartCompAddress
  );

  ///////////////////////// SMTBridge ///////////////////////
  let uniswapV2Factory = await smartCompInstance.getUniswapV2Factory();
  console.log('uniswapV2Factory:', uniswapV2Factory);

  let uniswapV2Router = await smartCompInstance.getUniswapV2Router();
  console.log('uniswapV2Router:', uniswapV2Router);

  let smtBridgeAddress = NA_SmartBridge;
  if (options.deploySMTBridge) {
    let tx = await smartCompInstance.setBUSD(deployedBusd.address);
    await tx.wait();

    let wbnb = await smartCompInstance.getWBNB();
    let busd = await smartCompInstance.getBUSD();
    console.log('wbnb:', wbnb);
    console.log('busd:', busd);

    let uniswapV2Factory = await smartCompInstance.getUniswapV2Factory();
    console.log('uniswapV2Factory:', uniswapV2Factory);

    cyan(`\nDeploying SMTBridge Contract...`);
    let deployedSMTBridge = await deploy('SMTBridge', {
      from: owner.address,
      args: [smartCompInstance.address],
      skipIfAlreadyDeployed: false
    });
    displayResult('SMTBridge contract', deployedSMTBridge);
    smtBridgeAddress = deployedSMTBridge.address;
    tx = await smartCompInstance.setSmartBridge(smtBridgeAddress);
    await tx.wait();
    console.log('set SmartBridge to SmartComp: ', tx.hash);
  } else {
    green(`\SMTBridge Contract deployed at ${smtBridgeAddress}`);
  }
  const smartBridgeIns = await ethers.getContractAt(
    'SMTBridge',
    smtBridgeAddress
  );

  ///////////////////////// Golden Tree Pool ////////////////////
  let goldenTreePoolAddress = NA_GoldenTreePool;
  const GoldenTreePool = await ethers.getContractFactory('GoldenTreePool');
  if (options.deployGoldenTreePool) {
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

    let tx = await smartCompInstance.setGoldenTreePool(goldenTreePoolAddress);
    await tx.wait();
    console.log('set GoldenTreePool to SmartComp: ', tx.hash);
  }
  if (options.upgradeGoldenTreePool) {
    green(`\nUpgrading GoldenTreePool contract...`);
    await upgrades.upgradeProxy(goldenTreePoolAddress, GoldenTreePool);
    green(`GoldenTreePool Contract Upgraded`);
  }
  if (!options.deployGoldenTreePool && !options.upgradeGoldenTreePool) {
    green(`\nGoldenTreePool Contract deployed at ${goldenTreePoolAddress}`);
  }
  const goldenTreePoolIns = await ethers.getContractAt(
    'GoldenTreePool',
    goldenTreePoolAddress
  );

  ///////////////// Smart Archievement ////////////////////
  let smartAchievementAddress = NA_SmartAchievement;
  const SmartAchievement = await ethers.getContractFactory('SmartAchievement');
  if (options.deploySmartAchievement) {
    cyan(`\nDeploying Smart Achievement contract...`);
    const SmartAchievementContract = await upgrades.deployProxy(
      SmartAchievement,
      [smartCompAddress, deployedSMTC.address],
      { initializer: 'initialize', kind: 'uups' }
    );
    await SmartAchievementContract.deployed();
    smartAchievementAddress = SmartAchievementContract.address;
    displayResult(
      'SmartAchievement Contract Address:',
      SmartAchievementContract
    );

    tx = await smartCompInstance.setSmartAchievement(smartAchievementAddress);
    await tx.wait();
    console.log('set GoldenTreePool to SmartComp: ', tx.hash);
  }
  if (options.upgradeSmartAchievement) {
    green(`\nUpgrading SmartAchievement contract...`);
    await upgrades.upgradeProxy(smartAchievementAddress, SmartAchievement);
    green(`\nSmartAchievement Contract Upgraded`);
  }
  if (!options.deploySmartAchievement && !options.upgradeSmartAchievement) {
    green(`\nSmartAchievement Contract deployed at ${smartAchievementAddress}`);
  }
  const smartAchievementIns = await ethers.getContractAt(
    'SmartAchievement',
    smartAchievementAddress
  );

  ///////////////// Smart Army //////////////////////
  let smartArmyAddress = NA_SmartArmy;
  const SmartArmy = await ethers.getContractFactory('SmartArmy');
  if (options.deploySmartArmy) {
    cyan(`\nDeploying SmartArmy contract...`);
    const SmartArmyContract = await upgrades.deployProxy(
      SmartArmy,
      [smartCompAddress],
      { initializer: 'initialize', kind: 'uups' }
    );
    await SmartArmyContract.deployed();
    smartArmyAddress = SmartArmyContract.address;
    displayResult('SmartArmy Contract Address:', SmartArmyContract);

    let tx = await smartCompInstance.setSmartArmy(smartArmyAddress);
    await tx.wait();
    console.log('set SmartArmy to SmartComp: ', tx.hash);
  }
  if (options.upgradeSmartArmy) {
    green(`\nUpgrading SmartArmy contract...`);
    await upgrades.upgradeProxy(smartArmyAddress, SmartArmy);
    green(`SmartArmy Contract Upgraded`);
  }
  if (!options.deploySmartArmy && !options.upgradeSmartArmy) {
    green(`\nSmartArmy Contract deployed at ${smartArmyAddress}`);
  }
  const smartArmyIns = await ethers.getContractAt(
    'SmartArmy',
    smartArmyAddress
  );

  ///////////////////// Smart Farm ////////////////////////
  let smartFarmAddress = NA_SmartFarm;
  const SmartFarm = await ethers.getContractFactory('SmartFarm');
  if (options.deploySmartFarm) {
    cyan(`\nDeploying SmartFarm contract...`);
    const SmartFarmContract = await upgrades.deployProxy(
      SmartFarm,
      [smartCompAddress],
      { initializer: 'initialize', kind: 'uups' }
    );
    await SmartFarmContract.deployed();
    smartFarmAddress = SmartFarmContract.address;
    displayResult('SmartFarm Contract Address:', SmartFarmContract);

    let tx = await smartCompInstance.setSmartFarm(smartFarmAddress);
    await tx.wait();
    console.log('set SmartFarm to SmartComp: ', tx.hash);

    let smartFarmInstance = await ethers.getContractAt(
      'SmartFarm',
      smartFarmAddress
    );
    tx = await smartFarmInstance
      .connect(owner)
      .addDistributor(userWallet.address);
    await tx.wait();
    console.log("Added user to distributor's list");
    tx = await smartFarmInstance
      .connect(owner)
      .addDistributor(anotherUser.address);
    await tx.wait();
    console.log("Added another user to distributor's list");
  }
  if (options.upgradeSmartFarm) {
    green(`\nUpgrading SmartFarm contract...`);
    await upgrades.upgradeProxy(smartFarmAddress, SmartFarm);
    green(`SmartFarm Contract Upgraded`);
  }
  if (!options.deploySmartFarm && !options.upgradeSmartFarm) {
    green(`\nSmartFarm Contract deployed at ${smartFarmAddress}`);
  }
  const smartFarmIns = await ethers.getContractAt(
    'SmartFarm',
    smartFarmAddress
  );

  ///////////////////////// Smart Ladder ///////////////////////////
  let smartLadderAddress = NA_SmartLadder;
  const SmartLadder = await ethers.getContractFactory('SmartLadder');
  if (options.deploySmartLadder) {
    cyan(`\nDeploying SmartLadder contract...`);
    SmartLadderContract = await upgrades.deployProxy(
      SmartLadder,
      [smartCompAddress, owner.address],
      { initializer: 'initialize', kind: 'uups' }
    );
    await SmartLadderContract.deployed();
    smartLadderAddress = SmartLadderContract.address;
    displayResult('SmartLadder Contract Address:', SmartLadderContract);

    let tx = await smartCompInstance.setSmartLadder(smartLadderAddress);
    await tx.wait();
    console.log('set SmartLadder to SmartComp: ', tx.hash);
  }
  if (options.upgradeSmartLadder) {
    green(`\nUpgrading SmartLadder contract...`);
    await upgrades.upgradeProxy(smartLadderAddress, SmartLadder);
    green(`SmartLadder Contract Upgraded`);
  }
  if (!options.deploySmartLadder && !options.upgradeSmartLadder) {
    green(`\nSmartLadder Contract deployed at ${smartLadderAddress}`);
  }
  const smartLadderIns = await ethers.getContractAt(
    'SmartLadder',
    smartLadderAddress
  );

  if (options.resetSmartComp) {
    let tx = await smartCompInstance.setSmartBridge(smtBridgeAddress);
    await tx.wait();
    console.log('set SmartBridge to SmartComp: ', tx.hash);

    tx = await smartCompInstance.setGoldenTreePool(goldenTreePoolAddress);
    await tx.wait();
    console.log('set GoldenTreePool to SmartComp: ', tx.hash);

    tx = await smartCompInstance.setSmartAchievement(smartAchievementAddress);
    await tx.wait();
    console.log('set SmartAchievement to SmartComp: ', tx.hash);

    tx = await smartCompInstance.setSmartArmy(smartArmyAddress);
    await tx.wait();
    console.log('set SmartArmy to SmartComp: ', tx.hash);

    tx = await smartCompInstance.setSmartFarm(smartFarmAddress);
    await tx.wait();
    console.log('set SmartFarm to SmartComp: ', tx.hash);

    tx = await smartCompInstance.setSmartLadder(smartLadderAddress);
    await tx.wait();
    console.log('set SmartLadder to SmartComp: ', tx.hash);
  }

  let smtTokenAddress = NA_SMT;
  if (options.deploySMTToken) {
    cyan(`\nDeploying SMT Token Contract...`);
    const SmartToken = await ethers.getContractFactory('SMT');
    let smtContract = await SmartToken.deploy(
      smartCompAddress,
      owner.address,
      owner.address
    );
    await smtContract.deployed();
    displayResult('\nSMT Token deployed at', smtContract);

    await displayWalletBalances(smtContract, true, false, false);

    smtTokenAddress = smtContract.address;

    tx = await smartCompInstance.setSMT(smtContract.address);
    await tx.wait();
    console.log('set SMT token to SmartComp: ', tx.hash);

    // tx = await smtContract.setSmartArmyAddress(smartArmyAddress);
    // await tx.wait();
    // console.log("set smart army instance to token: ", tx.hash);

    // tx = await smtContract.setSmartComp(smartCompAddress);
    // await tx.wait();
    // console.log("set SmartComp to SMT token: ", tx.hash);

    tx = await smtContract.setTaxLockStatus(
      false,
      false,
      false,
      false,
      false,
      false
    );
    await tx.wait();
    console.log('set tax lock status:', tx.hash);

    // tx = await smtContract.createBUSDPair(NA_Busd);
    // await tx.wait();
    // console.log("set busd pair:", tx.hash);

    // tx = await smtContract.createBNBPair();
    // await tx.wait();
    // console.log("set bnb pair:", tx.hash);
  }
  let smtContract = await ethers.getContractAt('SMT', smtTokenAddress);
  let router = await smartCompInstance.getUniswapV2Router();
  let routerInstance = new ethers.Contract(router, uniswapRouterABI, owner);

  if (options.testSMTTokenTransfer) {
    cyan('%%%%%%%%%%%%%%%% Transfer %%%%%%%%%%%%%%%%%');
    let tranferTx = await smtContract.transfer(
      anotherUser.address,
      ethers.utils.parseUnits('20000', 18)
    );
    await tranferTx.wait();
    console.log('SMT : owner -> another user transfer tx:', tranferTx.hash);

    tranferTx = await smtContract.transfer(
      userWallet.address,
      ethers.utils.parseUnits('20000', 18)
    );
    await tranferTx.wait();
    console.log('SMT : owner -> user transfer tx:', tranferTx.hash);

    tranferTx = await busdToken.transfer(
      anotherUser.address,
      ethers.utils.parseUnits('2000000', 18)
    );
    await tranferTx.wait();
    console.log('BUSD : owner -> another user transfer tx:', tranferTx.hash);

    tranferTx = await busdToken.transfer(
      userWallet.address,
      ethers.utils.parseUnits('2000000', 18)
    );
    await tranferTx.wait();
    console.log('BUSD : owner -> user transfer tx:', tranferTx.hash);

    await displayWalletBalances(smtContract, true, true, true);
    await displayWalletBalances(busdToken, true, true, true);
  }

  if (options.testAddLiquidity) {
    cyan('%%%%%%%%%%%%%%%% Liquidity %%%%%%%%%%%%%%%%%');
    let pairSmtcBnbAddr = await smtContract._uniswapV2ETHPair();
    console.log('SMT-BNB LP token address: ', pairSmtcBnbAddr);
    let pairSmtcBusdAddr = await smtContract._uniswapV2BUSDPair();
    console.log('SMT-BUSD LP token address: ', pairSmtcBusdAddr);

    let router = await smartCompInstance.getUniswapV2Router();
    console.log('router: ', router);

    let pairSmtcBnbIns = new ethers.Contract(
      pairSmtcBnbAddr,
      uniswapPairABI,
      userWallet
    );
    let pairSmtcBusdIns = new ethers.Contract(
      pairSmtcBusdAddr,
      uniswapPairABI,
      userWallet
    );

    // %%  when adding liquidity, owner have to be called for initial liquidity first.
    await addLiquidityToPools(
      smtContract,
      busdToken,
      routerInstance,
      owner,
      10000,
      0.1,
      10000,
      10000
    );

    await addLiquidityToPools(
      smtContract,
      busdToken,
      routerInstance,
      anotherUser,
      1000,
      0.05,
      1000,
      1000
    );

    await displayLiquidityPoolBalance(
      'SMT-BNB Pool Reserves: ',
      pairSmtcBnbIns
    );
    await displayLiquidityPoolBalance(
      'SMT-BUSD Pool Reserves: ',
      pairSmtcBusdIns
    );
  }

  if (options.testArmyLicense) {
    let pairSmtcBusdAddr = await smtContract._uniswapV2BUSDPair();
    let pairSmtBusdIns = new ethers.Contract(
      pairSmtcBusdAddr,
      uniswapPairABI,
      owner
    );
    await displayLiquidityPoolBalance('SMT-BUSD POOL:', pairSmtBusdIns);
    await displayWalletBalances(smtContract, false, false, true);

    let smtAddr = await smartCompInstance.getSMT();
    let farmAddr = await smartCompInstance.getSmartFarm();
    console.log('smt address: ', smtAddr);
    console.log('farm address: ', farmAddr);

    expect(await smartCompInstance.getSMT()).to.equal(smtContract.address);
    expect(await smartCompInstance.getSmartFarm()).to.equal(smartFarmAddress);

    await displayAllLicense(smartArmyIns);
    await buyLicense(smtContract, smartArmyIns, userWallet);
    await displayLicenseOf(smartArmyIns, userWallet.address);
    await displayWalletBalances(smtContract, false, false, true);
  }

  if (options.testSwap) {
    let isIntermediary = await smtContract.enabledIntermediary(
      userWallet.address
    );
    console.log('is allowed license: ', isIntermediary);

    let swapAmount = 100;
    let tx = await smtContract
      .connect(userWallet)
      .approve(
        smartBridgeIns.address,
        ethers.utils.parseUnits(Number(swapAmount + 1).toString(), 18)
      );
    await tx.wait();
    console.log('approved tx: ', tx.hash);

    let amountIn = ethers.utils.parseUnits(Number(swapAmount).toString(), 18);
    console.log('amountIn: ', amountIn);
    tx = await smartBridgeIns
      .connect(userWallet)
      .swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn,
        0,
        [smtContract.address, busdToken.address],
        userWallet.address,
        '99000000000000000000'
      );
    await tx.wait();
    console.log('Tx swapped for BUSD via SMT Bridge: ', tx.hash);

    tx = await smtContract
      .connect(userWallet)
      .approve(
        smartBridgeIns.address,
        ethers.utils.parseUnits(Number(swapAmount + 1).toString(), 18)
      );
    await tx.wait();
    console.log('approved tx: ', tx.hash);

    let wBNBAddress = await routerInstance.WETH();
    tx = await smartBridgeIns
      .connect(userWallet)
      .swapExactTokensForETHSupportingFeeOnTransferTokens(
        amountIn,
        0,
        [smtContract.address, wBNBAddress],
        userWallet.address,
        '99000000000000000000'
      );
    await tx.wait();
    console.log('Tx swapped for BNB via SMT Bridge: ', tx.hash);
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

// TEST 2

// require('hardhat-deploy');
// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-waffle");
// require('@openzeppelin/hardhat-upgrades');
// require("@nomiclabs/hardhat-etherscan");

// const projectId = "3fc88275178bd8b275851f04";
// const privateKey = "";
// const privateKey2 = "";
// const privateKey3 = "";
// const privateKey4 = "";
// // const apiKeyForEtherscan = "PJ2V5H4XH4P3PYXJE5JUM6VQRPRHQ56HDV";
// const apiKeyForEtherscan = "";
// const optimizerEnabled = !process.env.OPTIMIZER_DISABLED;

// /**
//  * @type import('hardhat/config').HardhatUserConfig
//  */
// module.exports = {
//   abiExporter: {
//     path: './abis',
//     clear: true,
//     flat: true,
//   },
//   etherscan: {
//     apiKey: apiKeyForEtherscan,
//   },
//   gasReporter: {
//     currency: 'USD',
//     gasPrice: 100,
//     enabled: process.env.REPORT_GAS ? true : false,
//   },
//   mocha: {
//     timeout: 30000,
//   },
//   namedAccounts: {
//     anotherUser: {
//       default: 0,
//       97: '0x9D3f7f55DBEb35E734e7405E8CECaDDB8D7e10b0'
//     },
//     smartComp: {
//       1: '0xb2dc5571f477b1c5b36509a71013bfedd9cc492f',
//       97: '0xb2dc5571f477b1c5b36509a71013bfedd9cc492f',
//       1337: '0xfA249599b353d964768817A75CB4E59d97758B9D'
//     },
//     smartBridge: {
//       default: 0,
//       1: '0xDa63D70332139E6A8eCA7513f4b6E2E0Dc93b693',
//       97: '0x729FBE5665dAe652aED9384150d4aF94e45fC2F8',
//       1337: '0x729FBE5665dAe652aED9384150d4aF94e45fC2F8'
//     },
//     goldenTreePool: {
//       default: 0,
//       1: '0x029Aa20Dcc15c022b1b61D420aaCf7f179A9C73f',
//       97: '0xd2146c8D93fD7Edd45C07634af7038E825880a64',
//       1337: '0xDAC575ddcdD2Ff269EE5C30420C96028Ba7cB304'
//     },
//     smartAchievement: {
//       default: 0,
//       1: '0xdd0134236ab968f39c1ccfc5d3d0de577f73b6d7',
//       97: '0xabcd4a0093232d729210c17b35b6aa8f66cab925',
//       1337: '0x828987A77f7145494bD86780349B204F32DB494A'
//     },
//     smartArmy: {
//       1: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
//       97: '0x357D51124f59836DeD84c8a1730D72B749d8BC23',
//       1337: '0x86E07ab6b97ADcd7897D960B0c61DFE5CEaD2E76'
//     },
//     smartFarm: {
//       1: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
//       97: '0x357D51124f59836DeD84c8a1730D72B749d8BC23',
//       1337: '0xb654476d77d59259fF1e7fF38B8c4d408639b844'
//     },
//     smartLadder: {
//       1: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
//       97: '0x357D51124f59836DeD84c8a1730D72B749d8BC23',
//       1337: '0xB5D0D6855EE08eb07eC4Ca51061c93D644367a1e'
//     },
//     usdt: {
//       1: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
//       97: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c',
//       1337: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c'
//     },
//     busd: {
//       1: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
//       97: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
//       1337: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47'
//     },
//   },
//   defaultNetwork: "hardhat",
//   networks: {
//     hardhat: {
//       // chainId: 4 //ethereum
//       chainId: 1337, //ethereum
//       // chainId: 97, //ethereum
//     },
//     localhost: {
//       url: "http://127.0.0.1:8545"
//     },
//     polygonmainnet: {
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/polygon/mainnet`,
//       accounts: [privateKey, privateKey2, privateKey3, privateKey4]
//     },
//     rosptentestnet:{
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/eth/ropsten`,
//       accounts: [privateKey, privateKey2, privateKey3, privateKey4]
//     },
//     mumbai: {
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/polygon/mumbai`,
//       accounts: [privateKey, privateKey2, privateKey3]
//     },
//     ethermainnet: {
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/eth/mainnet`,
//       accounts: [privateKey, privateKey2, privateKey3]
//     },
//     kovan: {
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/eth/kovan`,
//       accounts: [privateKey, privateKey2, privateKey3]
//     },
//     rinkeby: {
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/eth/rinkeby`,
//       accounts: [privateKey, privateKey2, privateKey3]
//     },
//     bscmainnet: {
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/bsc/mainnet`,
//       accounts: [privateKey, privateKey2, privateKey3]
//     },
//     fantom: {
//       url: "https://rpc.ftm.tools/",
//       accounts: [privateKey, privateKey2, privateKey3]
//     },
//     fantomtestnet: {
//       url: "https://rpc.testnet.fantom.network",
//       accounts: [privateKey, privateKey2, privateKey3]
//     },
//     bsctestnet: {
//       url: `https://speedy-nodes-nyc.moralis.io/${projectId}/bsc/testnet`,
//       accounts: [privateKey, privateKey2, privateKey3]
//     }
//   },
//   solidity: {
//     compilers: [
//       {
//         version: '0.8.0',
//         settings: {
//           optimizer: {
//             enabled: optimizerEnabled,
//             runs: 2000,
//           },
//           evmVersion: 'berlin',
//         }
//       },
//       {
//         version: '0.8.4',
//         settings: {
//           optimizer: {
//             enabled: optimizerEnabled,
//             runs: 2000,
//           },
//           evmVersion: 'berlin',
//         }
//       },
//       {
//         version: '0.6.12',
//         settings: {
//           optimizer: {
//             enabled: optimizerEnabled,
//             runs: 2000,
//           },
//           evmVersion: 'berlin',
//         }
//       },
//       {
//         version: '0.5.16',
//         settings: {
//           optimizer: {
//             enabled: optimizerEnabled,
//             runs: 2000,
//           },
//           evmVersion: 'berlin',
//         }
//       }
//     ],
//   },
// }
