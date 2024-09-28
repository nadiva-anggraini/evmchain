const fs = require('fs');
const path = require('path');

// Fungsi untuk mengubah 'kebab-case' menjadi 'camelCase'
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Fungsi untuk membaca file dari direktori dan mengonversi ke camelCase
function loadModulesFromDir(dir) {
  const modules = {};
  
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    
    if (fs.lstatSync(fullPath).isFile() && file.endsWith('.js')) {
      const moduleName = toCamelCase(path.basename(file, '.js'));
      modules[moduleName] = require(fullPath);
    }
  });
  
  return modules;
}

// Membaca subfolder testnet dan mainnet
const testnetChains = loadModulesFromDir(path.join(__dirname, 'testnet'));
const mainnetChains = loadModulesFromDir(path.join(__dirname, 'mainnet'));

// Mengekspor semuanya sebagai objek yang berjenjang
module.exports = {
  testnet: testnetChains,
  mainnet: mainnetChains,
};
