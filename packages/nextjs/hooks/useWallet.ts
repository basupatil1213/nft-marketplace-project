import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

export const useWallet = () => {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [BrowserProvider, setBrowserProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }
    try {
      const web3Provider = new Web3Provider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const signer = web3Provider.getSigner();
      const userAccount = await signer.getAddress();
      setProvider(web3Provider);
      setAccount(userAccount);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new Web3Provider(window.ethereum);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setProvider(web3Provider);
            setBrowserProvider(new ethers.BrowserProvider(window.ethereum));
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  return {
    provider,
    BrowserProvider,
    account,
    connectWallet,
    disconnectWallet,
  };
};