# 🖼️ NFT Marketplace Project

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

A full-stack, open-source NFT Marketplace for creating, minting, auctioning, and trading NFTs on Ethereum. Built with Next.js, Foundry, RainbowKit, Wagmi, Viem, and Typescript.

## 🚀 Features

- **Create NFT Collections:** Deploy your own ERC-721 NFT collections.
- **Mint NFTs:** Mint NFTs with metadata stored on IPFS via Pinata.
- **Auction NFTs:** List NFTs for auction, set starting bids and durations, and allow others to place bids.
- **View & Bid on Auctions:** Browse all active auctions, view NFT details, and place bids.
- **View Owned NFTs:** See all NFTs owned by your wallet, including those won in auctions.
- **Block Explorer:** Explore local blockchain transactions and blocks.
- **Smart Contract Registry:** All collections are registered and discoverable via a registry contract.

## 🧩 Smart Contracts

- `NFTCollection.sol`: ERC-721 contract with minting and metadata support.
- `NFTAuction.sol`: Handles auction creation, bidding, settlement, and fee distribution.
- `ContractRegistry.sol`: Registers and tracks all NFT collections.

## 🖥️ Frontend Pages

- `/mintCollection`: Deploy a new NFT collection.
- `/displaycollection/[contractadd]/view`: View all NFTs in a collection and start auctions.
- `/ownednfts`: View NFTs owned by the user and start auctions.
- `/auction`: Create an auction for an NFT.
- `/viewauction`: Browse and view all active auctions.
- `/blockexplorer`: Explore local blockchain activity.

## 🏁 Quickstart

### Requirements
- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Setup & Usage

1. **Install dependencies:**
   ```bash
   yarn install
   ```
2. **Run a local blockchain:**
   ```bash
   yarn chain
   ```
   This starts a local Ethereum network using Foundry. You can customize the network in `packages/foundry/foundry.toml`.
3. **Deploy contracts:**
   ```bash
   yarn deploy
   ```
   Deploys the smart contracts to your local network. Contracts are in `packages/foundry/contracts` and deployment scripts in `packages/foundry/script`.
4. **Start the frontend:**
   ```bash
   yarn start
   ```
   Visit your app at [http://localhost:3000](http://localhost:3000).

### Main User Flows
- **Create a Collection:** Go to `/mintCollection` and deploy a new NFT collection.
- **Mint NFTs:** Use the collection page to mint NFTs with IPFS metadata.
- **Auction NFTs:** From your collection or owned NFTs, start an auction for any NFT you own.
- **View & Bid on Auctions:** Browse `/viewauction` to see all active auctions and place bids.
- **View Owned NFTs:** `/ownednfts` shows all NFTs you own, including those won in auctions.
- **Block Explorer:** `/blockexplorer` lets you explore local blockchain activity.

### Development
- Edit smart contracts in `packages/foundry/contracts`
- Edit frontend pages in `packages/nextjs/app`
- Edit deployment scripts in `packages/foundry/script`

### Testing
- Run smart contract tests with:
  ```bash
  yarn foundry:test
  ```

## 📚 Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

## 🤝 Contributing

We welcome contributions!
See [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for guidelines.