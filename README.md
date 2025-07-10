# etherKipu TP4

This repository contains two main projects:

- **hardhat**: Smart contracts and deployment scripts for the etherKipu protocol.
- **fe**: Angular frontend for interacting with the SimpleSwap protocol.

---

## Hardhat Project (`/hardhat`)

This folder contains the Solidity smart contracts, tests, and deployment scripts.

### Deploying to Sepolia

1. **Install dependencies:**
   ```bash
   cd hardhat
   npm install
   ```

2. **Configure environment variables:**

   Create a `.env` file in the `hardhat` directory with your Sepolia RPC URL and private key:
   ```
   ALCHEMY_API_KEY
   SEPOLIA_PRIVATE_KEY
   ETHERSCAN_API_KEY
   ```

3. **Deploy the contract:**

   The main contract requires an `owner` address as a constructor parameter. Replace `YOUR_OWNER_ADDRESS` with the desired owner address.

   ```bash
   npx hardhat ignition deploy ./ignition/modules/SimpleSwapModule.js --owner YOUR_OWNER_ADDRESS
   ```

   - The deploy script will deploy the contracts to Sepolia and print the contract addresses.
   - Make sure the deployer account has Sepolia ETH for gas.

4. **Testing:**

   To run the tests locally:
   ```bash
   npx hardhat test
   ```

---

## Angular Frontend (`/fe`)

This folder contains the Angular application for interacting with the deployed contracts.

### Running the Frontend

1. **Install dependencies:**
   ```bash
   cd fe
   npm install
   ```

2. **Start the development server:**
   ```bash
   ng serve
   ```

   The app will be available at [http://localhost:4200](http://localhost:4200).

3. **Configuration:**

   - Update the contract addresses and network settings in the Angular environment files if needed.
   - The frontend expects the contracts to be deployed and accessible on Sepolia.

---

## Project Structure

```
/etherKipu
  /hardhat   # Solidity contracts, tests, and deployment scripts
  /fe        # Angular frontend application
```

---

## Notes

- The smart contracts are designed to be deployed with an explicit `owner` parameter.
- Make sure to use the correct addresses and network configuration for Sepolia.
- For more details, check the `README.md` files inside each subfolder.
