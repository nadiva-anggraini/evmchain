require('dotenv').config();
const { JsonRpcProvider } = require('ethers');

const rpcProviders = [  
  new JsonRpcProvider('https://mevm.devnet.imola.movementlabs.xyz'), 
];

let currentRpcProviderIndex = 0;  
  
function provider() {  
  return rpcProviders[currentRpcProviderIndex];  
}  
  
function rotateRpcProvider() {  
  currentRpcProviderIndex = (currentRpcProviderIndex + 1) % rpcProviders.length;  
  return provider();  
}

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const baseExplorerUrl = 'https://explorer.devnet.imola.movementlabs.xyz';

// Fungsi utama untuk merujuk ke explorer
const explorer = {
  get tx() {
    return (txHash) => `${baseExplorerUrl}/#/txn/${txHash}`;
  },
  get address() {
    return (address) => `${baseExplorerUrl}/#/account/${address}`;
  }
};

module.exports = { rotateRpcProvider, provider, PRIVATE_KEY, explorer };
