"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import deployedContracts from "../../contracts/deployedContracts";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";
import { getContractStore } from "~~/services/contractStore";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "";

function CreateAuctionComponent() {
  const { provider, account } = useWallet();
  const [startingBid, setStartingBid] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [creatingAuction, setCreatingAuction] = useState(false);

  const pinata = new PinataSDK({ pinataJwt: PINATA_JWT, pinataGateway: PINATA_GATEWAY_URL });

  const searchParams = useSearchParams();
  const contractaddress = searchParams.get("contractaddress");
  const tokenid = searchParams.get("tokenid");

  const fetchAuctionImage = async () => {
    if (!contractaddress || !tokenid || !provider) return;

    try {
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const networkId = network.chainId.toString();
      const numericNetworkId = parseInt(networkId, 10) as keyof typeof deployedContracts;
      const contractStore = getContractStore(numericNetworkId, signer as unknown as ethers.Signer);

      const collectionContract = contractStore.getCollectionContractFromAddress(contractaddress);
      if (!collectionContract) {
        console.error("Failed to get collection contract.");
        return;
      }

      const tokenURI = await collectionContract.tokenURI(tokenid);
      const metadataIpfs = tokenURI.replaceAll("ipfs://", "");
      const metadataFile = await pinata.gateways.get(metadataIpfs);
      const metadata = typeof metadataFile.data === "string" ? JSON.parse(metadataFile.data) : metadataFile.data;
      const imageUrl = metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") || "";
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Failed to fetch auction image:", error);
    }
  };

  useEffect(() => {
    fetchAuctionImage();
  }, [contractaddress, tokenid, provider]);

  const handleCreateAuction = async () => {
    if (!provider || !account || !startingBid || !hours || !minutes || !seconds || !contractaddress || !tokenid) {
      alert("Please provide all required inputs and connect your wallet.");
      return;
    }
    if (parseInt(startingBid) <= 0) {
      alert("Starting bid must be greater than 0.");
      return;
    }
    if (parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
      alert("Duration must be greater than 0.");
      return;
    }

    try {
      setStatus("Creating auction...");
      setCreatingAuction(true);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const networkId = network.chainId.toString();
      const numericNetworkId = parseInt(networkId, 10) as keyof typeof deployedContracts;
      const contractStore = getContractStore(numericNetworkId, signer as unknown as ethers.Signer);

      const collectionContract = contractStore.getCollectionContractFromAddress(contractaddress);
      if (!collectionContract) {
        console.error("Failed to get collection contract.");
        return;
      }

      const isApproved = await collectionContract.isApprovedForAll(
        account,
        deployedContracts[numericNetworkId].NFTAuction.address,
      );
      if (!isApproved) {
        setStatus("Setting approval for auction contract...");
        const tx = await collectionContract.setApprovalForAll(
          deployedContracts[numericNetworkId].NFTAuction.address,
          true,
        );
        await provider.waitForTransaction(tx.hash);
      }

      setStatus("Creating auction...");
      const auctionContract = contractStore.getAuctionContract();
      if (!auctionContract) {
        console.error("Failed to get auction contract.");
        return;
      }
      const duration = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds);
      const tx = await auctionContract.createAuction(
        contractaddress,
        tokenid,
        ethers.parseEther(startingBid),
        duration,
      );
      const receipt = await provider.waitForTransaction(tx.hash);
      if (receipt.status !== 1) {
        console.error("Failed to create auction.");
        return;
      }
      setStatus("Auction created successfully!");
    } catch (error) {
      setStatus("Failed to create auction!");
      console.error("Failed to create auction:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center py-10"
      style={{
        background: "linear-gradient(to bottom right, #1e3a8a, #4f46e5, #818cf8)",
      }}
    >
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Create an Auction</h1>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">
            <span className="font-bold">Contract Address:</span> {contractaddress?.slice(0, 6)}...
            {contractaddress?.slice(-4)}
          </p>
          <p className="text-lg font-semibold text-gray-700">
            <span className="font-bold">Token ID:</span> {tokenid}
          </p>
        </div>
        {imageUrl && (
          <div className="mb-6">
            <img src={imageUrl} alt="NFT" className="w-full h-64 object-cover rounded-md shadow-sm" />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-800 font-medium mb-2">Starting Bid (ETH)</label>
          <input
            type="number"
            placeholder="Enter starting bid"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            className="block w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-2">Duration (HH:MM:SS)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="HH"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-20 px-4 py-2 border rounded-lg text-center focus:ring focus:ring-blue-200 focus:outline-none"
            />
            <span>:</span>
            <input
              type="number"
              placeholder="MM"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-20 px-4 py-2 border rounded-lg text-center focus:ring focus:ring-blue-200 focus:outline-none"
            />
            <span>:</span>
            <input
              type="number"
              placeholder="SS"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              className="w-20 px-4 py-2 border rounded-lg text-center focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleCreateAuction}
          disabled={creatingAuction}
          className={`w-full py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition ${
            creatingAuction ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {creatingAuction ? "Creating Auction..." : "Create Auction"}
        </button>
        {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
  
}

export default function CreateAuction() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CreateAuctionComponent />
    </Suspense>
  );
}
