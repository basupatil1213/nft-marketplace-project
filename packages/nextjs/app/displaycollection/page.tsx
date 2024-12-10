"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";
import deployedContracts from "~~/contracts/deployedContracts";
import { getContractStore } from "~~/services/contractStore";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT!;
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

const pinata = new PinataSDK({ pinataJwt: PINATA_JWT, pinataGateway: PINATA_GATEWAY_URL });

interface NFTCollection {
    name: string;
    symbol: string;
    contractAddress: string;
    createdBy: string;
}

export default function ViewCollections() {
    const { provider, account } = useWallet();
    const [collections, setCollections] = useState<NFTCollection[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchAllCollections = async () => {
        if (!account || !provider) {
            alert("Please connect your wallet");
            return;
        }

        setLoading(true);

        const fetchedCollections: NFTCollection[] = [];
        try {
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            const networkId = network.chainId.toString();
            const numericNetworkId = parseInt(networkId, 10) as keyof typeof deployedContracts;
            console.log(`numericNetworkId`, numericNetworkId);
            const contractStore = getContractStore(numericNetworkId, signer as unknown as ethers.Signer);
            const registryConract = contractStore.getRegistryContract();
            if (!registryConract) {
                console.error("Failed to get registry contract.");
                return;
            }
            const collectionContractAddresses: string[] = await registryConract.getCollectionsByOwner(account);
            console.log(`collectionContractAddresses`, collectionContractAddresses);
            if (!collectionContractAddresses.length) {
                console.log("No collections found for this account.");
                return [];
            }

            for (const contractAddress of collectionContractAddresses) {
                const collectionMetadata = await registryConract.getCollectionMetadata(contractAddress);
                fetchedCollections.push({
                    name: collectionMetadata.name,
                    symbol: collectionMetadata.symbol,
                    contractAddress,
                    createdBy: account,
                });
            }
            setCollections(fetchedCollections);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (account && provider) {
            fetchAllCollections();
        }
    }, [account, provider]);

    const handleAdd = (contractAddress: string) => {
        router.push(`/displaycollection/${contractAddress}/add`);
    };

    const handleView = (contractAddress: string) => {
        router.push(`/displaycollection/${contractAddress}/view`);
    };

    return (
        <>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-10">
            <div className="container mx-auto px-4">
              <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
                Your NFT Collections
              </h1>
      
              {/* Loading Spinner */}
              {loading && (
                <div className="flex justify-center items-center mt-10">
                  <div className="w-16 h-16 border-4 border-blue-500 dark:border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
      
              {/* No Collections Found */}
              {!loading && collections.length === 0 && (
                <p className="text-center text-lg text-gray-700 dark:text-gray-300 font-semibold">
                  No collections found. Start creating one!
                </p>
              )}
      
              {/* Collections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                {collections.map(collection => (
                  <div
                    key={collection.contractAddress}
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105"
                  >
                    {/* Collection Name */}
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{collection.name}</h3>
                    {/* Collection Symbol */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">{collection.symbol}</p>
                    {/* Buttons */}
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => handleAdd(collection.contractAddress)}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => handleView(collection.contractAddress)}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
      
}