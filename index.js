const readlineSync = require('readline-sync');
const chains = require('./chains');
const { displayHeader, loadingAnimation, delay } = require('./src/utils/utils');
const { createWallet } = require('./src/utils/wallet');
const fs = require('fs');
const moment = require('moment-timezone');
const { parseUnits, formatUnits, isAddress } = require('ethers');

const PRIVATE_KEYS = JSON.parse(fs.readFileSync('privateKeys.json', 'utf-8'));
const getRandomAmount = (min, max) => Math.random() * (max - min) + min;

const displayAvailableChains = (network) => {
  const availableChains = Object.keys(chains[network]);
  console.log(`Available chains for ${network}:`);

  const columns = 4;
  const chainsPerColumn = Math.ceil(availableChains.length / columns);
  const maxChainLength = Math.max(...availableChains.map(chain => chain.length));
  const table = Array(chainsPerColumn).fill(null).map(() => Array(columns).fill(''));
  let index = 0;
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < chainsPerColumn; row++) {
      if (index < availableChains.length) {
        table[row][col] = availableChains[index].padEnd(maxChainLength, ' ');
        index++;
      }
    }
  }
  table.forEach(row => {
    console.log(row.join('   '));
  });
};

const chooseChain = (selectedNetwork) => {
  displayAvailableChains(selectedNetwork);
  console.log('');
  const selectedChain = readlineSync.question('Type the chain you want to use (eg. ethereum): ');
  const availableChains = Object.keys(chains[selectedNetwork]);
  if (!availableChains.includes(selectedChain)) {
    console.log(`Invalid chain for ${selectedNetwork}. Please type according to the list provided.`);
    process.exit(0);
  }

  return selectedChain;
};

const chooseNetwork = async () => {
  displayHeader();
  await loadingAnimation('Welcome to our bot...', 3600);
  const options = ['testnet', 'mainnet'];
  const index = readlineSync.keyInSelect(options, 'Choose a network to run the transaction on:');

  if (index === -1) {
    console.log('No network selected. Exiting...');
    process.exit(0);
  }

  return options[index];
  
};
let provider, explorer;

const doTransfer = async (privateKey, receiver, amount) => {
  try {
    const wallet = createWallet(privateKey, provider);
    const transaction = {
      to: receiver,
      value: amount,
    };
    const txResponse = await wallet.sendTransaction(transaction);
    const receipt = await txResponse.wait(1);
    const formattedAmount = formatUnits(amount, 18);
    console.log(`Transaction Confirmed for ${wallet.address} in block ${receipt.blockNumber} with Amount: ${formattedAmount}`.green);
    return txResponse.hash;

  } catch (error) {
    console.log(`[${moment().format('HH:mm:ss')}] Error executing transaction: ${error.message}`.red);
  }
};

const runTransfer = async () => {
  displayHeader();
  const selectedNetwork = await chooseNetwork();
  await loadingAnimation(`Checking available chains on ${selectedNetwork}...`, 3600);
  const selectedChain = chooseChain(selectedNetwork);

  if (selectedNetwork === 'testnet') {
    provider = chains.testnet[selectedChain].provider();
    explorer = chains.testnet[selectedChain].explorer;
  } else if (selectedNetwork === 'mainnet') {
    provider = chains.mainnet[selectedChain].provider();
    explorer = chains.mainnet[selectedChain].explorer;
  }

  let receiver;
  while (true) {
    receiver = readlineSync.question('Type recipient address to transfer: ');
    if (isAddress(receiver)) {
      break;
    } else {
      console.log('Invalid address. Please enter a valid Ethereum address.'.red);
    }
  }

  let numTransactions;
  while (true) {
    numTransactions = readlineSync.question('Type the number of transactions you want to perform: ');
    if (!isNaN(numTransactions) && Number.isInteger(Number(numTransactions)) && Number(numTransactions) > 0) {
      numTransactions = parseInt(numTransactions, 10);
      break;
    } else {
      console.log('Invalid input. Please enter a valid positive integer.'.red);
    }
  }

  const amountChoice = readlineSync.keyInSelect(['Fix Amount', 'Random Amount'], 'Choose amount type:');
  let amount;
  if (amountChoice === 0) {
    while (true) {
      const inputAmount = readlineSync.question('Type the fixed amount you want to send (eg 0.001): ');
      if (!isNaN(inputAmount) && Number(inputAmount) > 0) {
        amount = parseUnits(inputAmount, 18);
        break;
      } else {
        console.log('Invalid amount. Please enter a valid positive number.'.red);
      }
    }
    displayHeader();
    console.log('');
    await loadingAnimation(`Initiated ${numTransactions} transactions on ${selectedNetwork}...`, 3600);
    
    for (let i = 0; i < numTransactions; i++) {
      const receiptTx = await doTransfer(PRIVATE_KEYS[i % PRIVATE_KEYS.length], receiver, amount);
      if (receiptTx) {
        console.log(`[${moment().tz("Asia/Jakarta").format('HH:mm:ss [WIB]')}] Transaction Hash: ${explorer.tx(receiptTx)} (${i + 1}/${numTransactions})`.cyan);
      }
    }
  } else if (amountChoice === 1) {
    let minAmount, maxAmount;
    while (true) {
      minAmount = readlineSync.question('Type the minimum random amount you want to send (eg 0.001): ');
      maxAmount = readlineSync.question('Type the maximum random amount you want to send (eg 0.002): ');
      if (!isNaN(minAmount) && Number(minAmount) > 0 && !isNaN(maxAmount) && Number(maxAmount) > Number(minAmount)) {
        break;
      } else {
        console.log('Invalid amounts. Please ensure that minimum is less than maximum and both are positive numbers.'.red);
      }
    }
    displayHeader();
    console.log('');
    await loadingAnimation(`Starting ${numTransactions} transactions on ${selectedNetwork}...`, 3600);
    
    for (let i = 0; i < numTransactions; i++) {
      const randomValue = getRandomAmount(Number(minAmount), Number(maxAmount));
      amount = parseUnits(randomValue.toFixed(6).toString(), 18);
      const receiptTx = await doTransfer(PRIVATE_KEYS[i % PRIVATE_KEYS.length], receiver, amount);
      if (receiptTx) {
        console.log(`[${moment().tz("Asia/Jakarta").format('HH:mm:ss [WIB]')}] Transaction Hash: ${explorer.tx(receiptTx)} (${i + 1}/${numTransactions})`.cyan);
      }
    }
  } else {
    console.log('No amount type selected. Exiting...');
    process.exit(0);
  }

  await loadingAnimation('Finishing tranasction...', 3600);
  console.log('All transactions have been completed. Exiting....');
  console.log('');
};
runTransfer();
