import { ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import NFTCollection from "~~/contracts/NFTCollection.json";

export function getContractStore(numericNetworkId: number, signer: ethers.Signer) {
  const getRegistryContract = () => {
    const contractInfo = deployedContracts[numericNetworkId as keyof typeof deployedContracts]?.ContractRegistry;
    if (!contractInfo) {
      alert(`NFTCollectionRegistry contract is not deployed on network ${numericNetworkId}`);
      return;
    }
    return new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
  };

  const getAuctionContract = () => {
    const contractInfo = deployedContracts[numericNetworkId as keyof typeof deployedContracts]?.NFTAuction;
    if (!contractInfo) {
      alert(`NFTAuction contract is not deployed on network ${numericNetworkId}`);
      return;
    }
    return new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
  };

  const getCollectionContract = () => {
    const contractInfo = deployedContracts[numericNetworkId as keyof typeof deployedContracts]?.NFTCollection;
    if (!contractInfo) {
      alert(`NFTCollection contract is not deployed on network ${numericNetworkId}`);
      return;
    }
    return new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
  };

  const getCollectionContractFactory = () => {
    const contractInfo = deployedContracts[numericNetworkId as keyof typeof deployedContracts]?.NFTCollection;
    if (!contractInfo) {
      alert(`NFTCollection contract is not deployed on network ${numericNetworkId}`);
      return;
    }
    return new ethers.ContractFactory(contractInfo.abi, NFTCollection.bytecode, signer);
  };

  const getCollectionContractFromAddress = (address: string) => {
    const contractInfo = deployedContracts[numericNetworkId as keyof typeof deployedContracts]?.NFTCollection;
    if (!contractInfo) {
      alert(`NFTCollection contract is not deployed on network ${numericNetworkId}`);
      return;
    }
    return new ethers.Contract(address, contractInfo.abi, signer);
  };

  return {
    getRegistryContract,
    getAuctionContract,
    getCollectionContract,
    getCollectionContractFactory,
    getCollectionContractFromAddress,
  };
}