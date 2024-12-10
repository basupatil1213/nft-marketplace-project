"use client";

import { useState } from "react";
import deployedContracts from "../../contracts/deployedContracts";
import { useWallet } from "~~/hooks/useWallet";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";
import { getContractStore } from "~~/services/contractStore";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "";

export default function CreateCollection() {
  const { provider, account } = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [status, setStatus] = useState("");

  const pinata = new PinataSDK({ pinataJwt: PINATA_JWT, pinataGateway: PINATA_GATEWAY_URL });

  const handleDeployCollection = async () => {
    if (!provider || !name || !symbol) {
      alert("Please provide all required inputs and connect your wallet.");
      return;
    }

    setStatus("Deploying new NFT collection contract...");
    try {
      const signer = provider.getSigner();

      console.log(`signer`, signer);
      const network = await provider.getNetwork();
      console.log(`network`, network);
      const networkId = network.chainId.toString();
      console.log(`networkId`, networkId);
      const numericNetworkId = parseInt(networkId, 10) as keyof typeof deployedContracts;
      const contractStore:any = getContractStore(numericNetworkId, signer as unknown as ethers.Signer);
      const factory = contractStore.getCollectionContractFactory();
      if (!factory) {
        console.error("Failed to get collection contract factory.");
        return;
      }
      const contract = await factory.deploy(name, symbol);
      const deploymentTx = contract.deploymentTransaction();
      if (!deploymentTx) {
        throw new Error("Deployment transaction not found. Deployment might have failed.");
      }

      if(deploymentTx.hash){
        console.log(`deploymentTx.hash`, deploymentTx.hash);
        const receipt = await provider.getTransactionReceipt(deploymentTx.hash);
        console.log(`receipt`, receipt);
      }
      else{
        alert(`no hash`);
      }
      const receipt = await provider.waitForTransaction(deploymentTx.hash);
      if (!receipt) {
        throw new Error("Transaction receipt not found. Deployment might have failed.");
      }
      if (receipt.status === 1) {
        console.log("✅ Contract deployed successfully at address:", contract.target);
      } else {
        console.error("❌ Deployment failed. Receipt status:", receipt?.status);
      }
      const contractAddress = receipt.contractAddress;

      console.log("Creating metadata...");
      const metadata = { name, symbol, contractAddress, createdBy: account };
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const metadataFile = new File([metadataBlob], `${contractAddress}_metadata.json`);
      const metadataResponse = await pinata.upload.file(metadataFile);
      const metadataUrl = `ipfs://${metadataResponse.IpfsHash}`;
      console.log("Metadata uploaded to Pinata:", metadataUrl);

      const registryConract = await contractStore.getRegistryContract();
      if (!registryConract) {
        console.error("Failed to get registry contract.");
        return;
      }
      console.log(`registrycontract ${registryConract}`);
      console.log("Registering collection...");
      const tx = await registryConract.registerCollection(contractAddress, account, name, symbol);
      
      const registerdCollectionReceipt = await provider.waitForTransaction(tx.hash);
      console.log(`registerdCollectionReceipt`, registerdCollectionReceipt);
      if (registerdCollectionReceipt.status === 1) {
        console.log("✅ Collection registered successfully!");
        setStatus(`Collection registered successfully at ${contractAddress}`);
      } else {
        setStatus("Collection registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error deploying contract:", error);
      setStatus("Failed to deploy contract.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Create Your NFT Collection
        </h1>
        <div className="space-y-4">
          {/* Collection Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Collection Name
            </label>
            <input
              type="text"
              placeholder="Enter Collection Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
  
          {/* Symbol Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Symbol
            </label>
            <input
              type="text"
              placeholder="Enter Symbol"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
  
          {/* Deploy Button */}
          <button
            onClick={handleDeployCollection}
            disabled={!provider || status.includes("Deploying")}
            className={`w-full px-4 py-2 text-white font-bold rounded-lg transition ${
              status.includes("Deploying")
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } flex items-center justify-center`}
          >
            {status.includes("Deploying") ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Deploying...
              </>
            ) : (
              "Deploy Collection"
            )}
          </button>
  
          {/* Status Message */}
          {status && (
            <div
              className={`mt-4 px-4 py-2 rounded-lg text-sm ${
                status.includes("successfully")
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}