import { ChangeEvent, useState, useEffect } from "react";
import { ethers } from "ethers";
import { pinata } from "~~/utils/scaffold-eth/config";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import NFTCollectionABI from "~~/contracts/NFTCollection.json";



interface IMetadata {
    description: string;
    image: string;
    name: string;
}

type deployCollectionContract = (name: string, token: string) => Promise<string>;


const MintNFT: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [NFTName, setNFTName] = useState<string>("");
    const [NFTDescription, setNFTDescription] = useState<string>("");
    const [NFTToken, setNFTToken] = useState<string>("");
    const [cid, setCid] = useState<string | null>(null);
    const [metadataCid, setMetadataCid] = useState<string | null>(null);
    const [tokenContract, setTokenContract] = useState<ethers.Contract | "">("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");


    // contract related
    const [collectionContractAddress, setCollectionContractAddress] = useState<string>("");
    const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("ContractRegistry");

    const deployCollectionContract: deployCollectionContract = async (name, token) => {
        console.log("deployCollectionContract: start");
        if (!window.ethereum) {
            alert("Please install MetaMask or another Ethereum-compatible browser extension to use this dApp.");
            throw new Error("Ethereum provider is not available");
        }
        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const provider_network = await provider.getNetwork();

            console.log("provider_network: ", provider_network);
            console.log("signer: ", signer);
            console.log("provider: ", provider);
            // alert("wait");
            const NFTCollectionFactory = new ethers.ContractFactory(
                NFTCollectionABI.abi,
                NFTCollectionABI.bytecode,
                signer
            );
            console.log("NFTCollectionFactory: ", JSON.stringify(NFTCollectionFactory));
            const nftCollection = await NFTCollectionFactory.deploy(name, token);
            const address = await nftCollection.getAddress();
            console.log("address: ", address);
            console.log("deployCollectionContract: end");
            return address;
        } catch (err: any) {
            setError(err.message || "Something went wrong while deploying the contract.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    const initializeContract = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            if (!collectionContractAddress) return;
            const contract = new ethers.Contract(collectionContractAddress, NFTCollectionABI.abi, signer);
            setTokenContract(contract);
        } else {
            console.error("MetaMask not installed; using read-only defaults");
        }
    };

    useEffect(() => {
        initializeContract();
    }, [collectionContractAddress]);

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
        setImageUrl(URL.createObjectURL(file));
    };

    const handleFileSubmission = async () => {
        if (!selectedFile) return;
        try {
            const upload = await pinata.upload.file(selectedFile);
            setCid(upload.IpfsHash);
            console.log("CID: ", upload.IpfsHash);
            const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
            console.log("IPFS URL: ", ipfsUrl);
            setImageUrl(ipfsUrl);
        } catch (error) {
            console.log(error);
        }
    };

    const pinImageMetadataToIPFS = async () => {
        if (cid && NFTName && NFTDescription) {
            const metadata: IMetadata = {
                name: NFTName,
                description: NFTDescription,
                image: `ipfs://${cid}`,
            };

            try {
                const upload = await pinata.upload.json(metadata);
                setMetadataCid(upload.IpfsHash);
                const metadataURI = `ipfs://${upload.IpfsHash}`;
                console.log("Minting NFT with URI: ", metadataURI);
                await mintNFT(metadataURI);
            } catch (error) {
                console.log("Error while uploading metadata to IPFS: ", error);
            }
        }
    };


    const mintNFT = async (_tokenURI: string) => {
        if (!tokenContract) return;
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(collectionContractAddress, NFTCollectionABI.abi, signer);
            const tx = await contract.safeMint(window.ethereum, _tokenURI);
            await tx.wait();

        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {


            event.preventDefault();
            if (!selectedFile || !NFTName || !NFTDescription) return;
            setIsLoading(true);
            const address = await deployCollectionContract(NFTName, NFTToken);
            setCollectionContractAddress(address);
            console.log("Collection Contract Address: ", address);
            console.log("NFT Name: ", NFTName);
            console.log("NFT Description: ", NFTDescription);
            await handleFileSubmission();
            await pinImageMetadataToIPFS();
            const res = await writeYourContractAsync({
                functionName: "registerCollection",
                args: [address, NFTName, NFTToken],
            });

            console.log("res: ", res);
        } catch (error) {
            console.error(error);

        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h1 className="text-2xl font-semibold text-gray-700">Mint Your NFT</h1>

                        <div>
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center bg-blue-500 text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-600"
                            >
                                <span>Upload File</span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    className="hidden"
                                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                                />
                            </label>
                            {imageUrl && (
                                <div className="mt-4 flex justify-center">
                                    <img src={imageUrl} alt="Selected" className="w-48 h-48 rounded-lg object-cover" />
                                </div>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="NFT Name"
                                value={NFTName || ""}
                                onChange={(e) => setNFTName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="NFT Token"
                                value={NFTToken || ""}
                                onChange={(e) => setNFTToken(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                required
                            />
                        </div>

                        <div>
                            <textarea
                                placeholder="NFT Description"
                                value={NFTDescription || ""}
                                onChange={(e) => setNFTDescription(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                rows={4}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:ring focus:ring-green-300"
                        >
                            Mint NFT
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export { MintNFT };
