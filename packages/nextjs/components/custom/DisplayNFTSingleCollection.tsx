import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';
import NFTCollectionABI from "~~/contracts/NFTCollection.json";

const DisplaySingleNFTCollection = ({ contractAddress }: { contractAddress: string }) => {
    const [tokens, setTokens] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchTokenURIs = async () => {
            setLoading(true);
            if (contractAddress && window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const nftContract = new ethers.Contract(contractAddress, NFTCollectionABI.abi, signer);
                console.log("nftContract: ", nftContract);
                try {
                    const totalSupply = await nftContract.tokensAndURIsOfOwner(signer.getAddress());
                    // const tokens = await nftContract.tokensOfOwner(signer.getAddress());
                    // for (let i = 0; i < totalSupply; i++) {
                    //     const tokenId = await nftContract.tokenByIndex(i);
                    //     const tokenURI = await nftContract.tokenURI(tokenId);
                    //     tokens.push({ tokenId, tokenURI });
                    // }
                    console.log("Total Supply:", totalSupply.toString());
                    setTokens(tokens);
                }
                catch (error) {
                    console.error(error);
                }
            }
            setLoading(false);
        };

        fetchTokenURIs();
    }, [contractAddress]);

    return (
        <div>
            <h1>NFT Collection</h1>
            <h1>address: {contractAddress}</h1>
            {loading ? (
                <p>Loading tokens...</p>
            ) : tokens.length > 0 ? (
                <ul>
                    {tokens.map((token, index) => (
                        <li key={index}>
                            <p>Token ID: {token.tokenId}</p>
                            <p>Token URI: {token.tokenURI}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tokens found.</p>
            )}
        </div>
    );
};

export default DisplaySingleNFTCollection;