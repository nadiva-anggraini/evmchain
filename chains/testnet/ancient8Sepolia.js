require('dotenv').config();
const { JsonRpcProvider } = require('ethers');

const rpcProviders = [  
  new JsonRpcProvider('https://rpcv2-testnet.ancient8.gg'), 
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

const baseExplorerUrl = 'https://scanv2-testnet.ancient8.gg';

// Fungsi utama untuk merujuk ke explorer
const explorer = {
  get tx() {
    return (txHash) => `${baseExplorerUrl}/tx/${txHash}`;
  },
  get address() {
    return (address) => `${baseExplorerUrl}/address/${address}`;
  }
};

module.exports = { rotateRpcProvider, provider, PRIVATE_KEY, explorer };
