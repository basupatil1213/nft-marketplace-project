"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import deployedContracts from "../../contracts/deployedContracts";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";
import { getContractStore } from "~~/services/contractStore";

interface NFT {
  contractAddress: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
}

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "";

export default function PurchasedNFTs() {
  const { provider, account } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pinata = new PinataSDK({ pinataJwt: PINATA_JWT, pinataGateway: PINATA_GATEWAY_URL });

  const fetchNFTs = async () => {
    if (!provider || !account) {
      alert("Please connect your wallet");
      return;
    }

    setLoading(true);

    try {
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const networkId = network.chainId.toString();
      const numericNetworkId = parseInt(networkId, 10) as keyof typeof deployedContracts;
      const contractStore = getContractStore(numericNetworkId, signer as unknown as ethers.Signer);

      const registryContract = contractStore.getRegistryContract();
      if (!registryContract) {
        console.error("Failed to get registry contract");
        return;
      }

      const auctionContract = contractStore.getAuctionContract();
      if (!auctionContract) {
        console.error("Failed to get auction contract");
        return;
      }

      const collections = await registryContract.getAllCollections();
      const fetchedNFTs: NFT[] = [];
      for (const collection of collections) {
        const collectionContract = contractStore.getCollectionContractFromAddress(collection);
        if (!collectionContract) {
          console.error("Failed to get collection contract");
          return;
        }

        const tokenIds: ethers.BigNumberish[] = await collectionContract.getTokensOfOwner(account);
        for (const tokenId of tokenIds) {
          const auctionedNFTs = await auctionContract.isAuctionSettled(collection, tokenId);
          if (!auctionedNFTs) continue;

          const tokenURI = await collectionContract.tokenURI(tokenId);
          const metadataIpfs = tokenURI.replace("ipfs://", "");
          const metadataFile = await pinata.gateways.get(metadataIpfs);
          const metadata = typeof metadataFile.data === "string" ? JSON.parse(metadataFile.data) : metadataFile.data;
          fetchedNFTs.push({
            contractAddress: collection,
            tokenId: tokenId.toString(),
            name: metadata.name || "Unknown Name",
            description: metadata.description || "No Description",
            image: metadata.image?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") || "",
          });
        }
      }
      setNfts(fetchedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuction = (contractAddress: string, tokenId: string) => {
    router.push(`/auction?contractaddress=${contractAddress}&tokenid=${tokenId}`);
  };

  useEffect(() => {
    if (provider && account) {
      fetchNFTs();
    }
  }, [provider, account]);

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Your NFTs</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary border-opacity-70"></div>
          <p className="ml-3 text-lg font-semibold text-primary">Fetching your NFTs...</p>
        </div>
      )}

      {/* No NFTs Found */}
      {!loading && nfts.length === 0 && (
        <p className="text-lg font-semibold text-gray-500">No NFTs found in your wallet.</p>
      )}

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 w-full max-w-5xl">
        {nfts.map(nft => (
          <div
            key={nft.tokenId}
            className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col items-center p-6 transition-transform transform hover:scale-105"
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{nft.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{nft.description}</p>
            <p className="text-sm text-gray-500">
              <strong>Token ID:</strong> {nft.tokenId}
            </p>
            <button
              onClick={() => handleCreateAuction(nft.contractAddress, nft.tokenId)}
              className="mt-4 btn btn-primary w-full"
            >
              Auction NFT
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
