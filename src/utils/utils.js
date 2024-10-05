require('colors');
const moment = require('moment');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function displayHeader() {
  process.stdout.write('\x1Bc');
  console.log('===================================================='.cyan);
  console.log('                                                    '.cyan);
  console.log(' 8888888b.  d8b                        888          '.cyan);
  console.log(' 888   Y88b Y8P                        888          '.cyan);
  console.log(' 888    888                            888          '.cyan);
  console.log(' 888   d88P 888  8888b.  88888b.   .d88888  8888b.  '.cyan);
  console.log(' 8888888P"  888     "88b 888 "88b d88" 888     "88b '.cyan);
  console.log(' 888 T88b   888 .d888888 888  888 888  888 .d888888 '.cyan);
  console.log(' 888  T88b  888 888  888 888  888 Y88b 888 888  888 '.cyan);
  console.log(' 888   T88b 888 "Y888888 888  888  "Y88888 "Y888888 '.cyan);
  console.log('                                                    '.cyan);
  console.log('===================================================='.cyan);
  console.log();
}
const loadingAnimation = (message, duration) => {
  return new Promise((resolve) => {
    const symbols = ['|', '/', '-', '\\'];
    let currentIndex = 0;

    const intervalTime = 200;
    let totalIterations = duration / intervalTime;

    const interval = setInterval(() => {
      process.stdout.write(`\r${message} [${symbols[currentIndex]}]`);
      currentIndex = (currentIndex + 1) % symbols.length;

      if (totalIterations-- <= 0) {
        clearInterval(interval);
        process.stdout.write('\n');
        resolve();
      }
    }, intervalTime);
  });
};

module.exports = { delay, displayHeader, loadingAnimation };
