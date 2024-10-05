# Chain Management and Transaction Example

This project provides a simple module for managing blockchain networks (chains) and an example of how to interact with these networks, such as sending native token transactions.

## Features

- **Chain Management:** Add, delete, and view available chains (testnet/mainnet).
- **Transaction Example:** Demonstrates how to send native tokens to a specified address using the available chains.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
2. Install dependencies:
   ```bash
   npm install

# Usage
## Running the Transaction Example
   To run the transaction example, use:
   npm run start
   or
   node index.js
   This will execute the transaction process using the chain module.

## Manage chains
To manage chains (add, delete, view available chains), use:
npm run manage
or
node managechain.js

## Chain Management Operations
Add Chain: Add a new chain to either testnet or mainnet.
Delete Chain: Remove a chain from testnet or mainnet.
View Chains: View all chains in testnet or mainnet.

## Scripts
npm run start - Runs the transaction example.
npm run manage - Opens the chain management tool.
