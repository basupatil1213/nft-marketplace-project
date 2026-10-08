# 🖼️ NFT Marketplace Project

A full-stack, open-source NFT marketplace for creating, minting, auctioning, and trading NFTs on Ethereum. Built with Next.js, Foundry, RainbowKit, Wagmi, Viem, and TypeScript on top of [Scaffold-ETH 2](https://scaffoldeth.io) ([docs](https://docs.scaffoldeth.io)).

**Live frontend:** https://nft-marketplace-project-nextjs.vercel.app

## 🚀 Features

- **Create NFT Collections:** Deploy your own ERC-721 NFT collections.
- **Mint NFTs:** Mint NFTs with metadata stored on IPFS via Pinata.
- **Auction NFTs:** List NFTs for auction, set starting bids and durations, and allow others to place bids.
- **View & Bid on Auctions:** Browse all active auctions, view NFT details, and place bids.
- **View Owned NFTs:** See all NFTs owned by your wallet, including those won in auctions.
- **Block Explorer:** Explore local blockchain transactions and blocks.
- **Smart Contract Registry:** All collections are registered and discoverable via a registry contract.

## 🧩 Smart Contracts

Located in `packages/foundry/contracts`:

- `NFTCollection.sol`: ERC-721 contract with minting and metadata support.
- `NFTAuction.sol`: Handles auction creation, bidding, settlement, and fee distribution.
- `ContractRegistry.sol`: Registers and tracks all NFT collections.

The Next.js frontend lives in `packages/nextjs`.

## 🛠 Tech stack

Next.js, TypeScript, Foundry (Solidity), Viem, Wagmi, RainbowKit, IPFS/Pinata

## ⚡ Quickstart

```bash
yarn install
yarn chain    # start a local Foundry chain
yarn deploy   # deploy the contracts locally (in a second terminal)
yarn start    # run the frontend at http://localhost:3000
```

Run the contract tests with:

```bash
yarn test
```
