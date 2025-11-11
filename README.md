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
NFT Marketplace Project

Overview
--------
Full-stack NFT marketplace using Next.js frontend and Foundry smart contracts for on-chain logic. Supports minting, auctions and local chain development for testing.

Tech stack
----------
Next.js, Foundry, Typescript, Viem, Wagmi, RainbowKit

Quickstart
----------
1. yarn install
2. yarn chain (start local Foundry chain)
3. yarn deploy (deploy contracts locally)
4. yarn start (run frontend)

Notes
-----
Contracts are located in `packages/foundry/contracts` and frontend in `packages/nextjs`.
