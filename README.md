# Project TP4 EtherKipu

Practical Assignment to apply the knowledge acquired in module 4 of the EtherKipu course, passing which is a necessary condition for advancing to the next module.

## Table of Contents
1. [Description](#description)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Hardhat Project](#hardhat-project)
   - [Hardhat Setup](#hardhat-setup)
   - [Smart Contract Compile](#smart-contract-compile)
   - [Smart Contract Testing and Coverage](#smart-contract-testing-and-coverage)
   - [Smart Contract Deploy](#smart-contract-deploy)
6. [SPA Frontend (Angular)](#spa-frontend-angular)
   - [SPA Setup](#spa_setup)
   - [SPA Run](#spa-run)
   - [SPA Deploy](#spa-deploy)
7. [Demo](#demo)

## Description

This Practical Assignment consists of a token exchange application implemented by a smart contract as a backend and a SPA (Single Page Application) as a frontend.
It consists of a Hardhat project for coding, compiling, testing, and deploying the smart contract; and an Angular project for coding, compiling, and testing the SPA through which a user will interact with the smart contract.

## Technologies Used

- **Hardhat** for deploying and testing smart contracts.
- **Angular** for developing the frontend of the smart contract.
- **Solidity** for smart contracts.
- **Node.js** for backend and development environment.
- **TypeScript** (for the Angular frontend).

## Project Structure

```
/etherKipu
  /hardhat   # Solidity contracts, tests, and deployment scripts
    /contracts  # Solidity contracts
    /ignition
      /modules # Hardhat modules for contracts deployment
    /test # Smart Contrsct Unit Tests 

  /fe        # Angular frontend application
```

## Prerequisites

- Node.js (v18+ recommended)
- npm o yarn
- Angular CLI (`npm install -g @angular/cli`)
- Hardhat (`npm install --save-dev hardhat`)
- MetaMask or another Ethereum-compatible wallet

## Hardhat Project

## Hardhat Setup

1. **Install dependencies:**
   ```bash
   cd hardhat
   npm install
   ```

2. **Configure environment variables:**

   Set the following environment variables with the command:
   $ npx hardhat vars set <VARIABLE_KEY>
   ✔ Enter value: ********************************

   ```
   ALCHEMY_API_KEY
   SEPOLIA_PRIVATE_KEY
   ETHERSCAN_API_KEY
   OWNER_ADDRESS
   ```

## Smart Contract Compile
To compile your contracts in your Hardhat project, use the built-in compile task

   ```
   $ npx hardhat compile
   Compiling...
   Compiled 1 contract successfully
   ```
The compiled artifacts will be saved in the artifacts/ directory by default

## Smart Contract Testing and Coverage
To run the unit tests, execute the following command:

   ```
   $ npx hardhat test
   ```
To measure unit test coverage, run the following command:

   ```
   $ npx hardhat coverage
   ```

The current contract coverage is detailed below
  ```
-----------------|----------|----------|----------|----------|----------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------|----------|----------|----------|----------|----------------|
 contracts/      |    91.57 |    46.43 |    72.73 |    92.93 |                |
  MyTokenA.sol   |       50 |    16.67 |       60 |       50 |          18,22 |
  MyTokenB.sol   |       50 |    16.67 |       60 |       50 |          17,21 |
  SimpleSwap.sol |       96 |    51.39 |    83.33 |     96.7 |      56,64,279 |
-----------------|----------|----------|----------|----------|----------------|
All files        |    91.57 |    46.43 |    72.73 |    92.93 |                |
-----------------|----------|----------|----------|----------|----------------|
   ```

## Smart Contract Deploy
We deploy and verify the smart contracts of the respective tokens A and B that will be exchanged by the Simple Swap contract, executing the following commands:

   ```
   $ npx hardhat ignition deploy ./ignition/modules/TokenAModule.js --network <your-network> --verify
   $ npx hardhat ignition deploy ./ignition/modules/TokenBModule.js --network <your-network> --verify
   ```

Then deploy the smart contract that will carry out the token exchange, SimpleSwap:

   ```
   $ npx hardhat ignition deploy ./ignition/modules/SimpleSwapModule.js --network <your-network> --verify
   ```

- The deploy script will deploy the contracts to the specified network and print the contract addresses.
- Make sure the deployer account has ETH for gas.

 ## SPA Frontend (Angular)

 ## SPA Setup

 1. **Install dependencies:**

   ```bash
   cd fe
   npm install
   ```

2. **Configuration:**

   - Update the contract addresses and network settings in the Angular environment files if needed.
   - The frontend expects the contracts to be deployed.

## SPA Run

Start the development server with the following command:

   ```
   npm run start
   ```
The app will be available at [http://localhost:4200](http://localhost:4200).

## SPA Deploy

To prepare the Angular single-page application (SPA) for production and host it on a static web server, follow these steps:

1. **Build the Application**

Run the production build command:

```bash
ng build --configuration production
```

This generates an optimized build in the dist/<project-name>/ directory, with the following types of files:

index.html – main entry point

main.[hash].js – compiled application code

polyfills.[hash].js – browser compatibility code

styles.[hash].css – global styles

assets/ – images, fonts, translations, etc.


2. **Deploy to a Static Web Server**

Copy the contents of the dist/<project-name>/ folder to your web server's public directory.

3. **UAT Version**

Click the following link to try the Trial version https://ccalinez.github.io/

## Demo
To see a live demonstration, access the following link https://drive.google.com/file/d/187RKBd5opLSpP3iUjqbyAaMO1MJGPedq/view?usp=sharing