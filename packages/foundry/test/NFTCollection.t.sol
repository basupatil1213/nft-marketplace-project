// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/NFTCollection.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract NFTCollectionTest is Test {
    NFTCollection private nftCollection;
    address private owner;
    address private user;

    function setUp() public {
        // Deploy the contract and set up initial state
        nftCollection = new NFTCollection("Test NFT", "TNFT");
        owner = address(this); // Test contract deployer
        user = address(0x123); // A user address for testing
    }

    function testMintToken() public {
        string memory ipfsHash = "QmSomeHash"; // Example IPFS hash
        uint256 tokenId = nftCollection.mintToken(user, ipfsHash);

        // Check if the minted token ID is correct
        assertEq(tokenId, 1, "Token ID should be 1 after first mint");

        // Check if the token URI is set correctly
        string memory tokenUri = nftCollection.tokenURI(tokenId);
        assertEq(
            tokenUri,
            string(abi.encodePacked("ipfs://", ipfsHash)),
            "Token URI should match the IPFS hash"
        );

        // Check if the token is owned by the user
        uint256[] memory userTokens = nftCollection.getTokensOfOwner(user);
        assertEq(userTokens.length, 1, "User should own one token");
        assertEq(
            userTokens[0],
            tokenId,
            "User's token ID should match the minted token"
        );
    }

    function testTotalMinted() public {
        // Mint a few tokens
        nftCollection.mintToken(user, "QmHash1");
        nftCollection.mintToken(user, "QmHash2");
        nftCollection.mintToken(user, "QmHash3");

        // Check the total minted tokens count
        uint256 totalMinted = nftCollection.totalMinted();
        assertEq(totalMinted, 3, "Total minted should be 3 after three mints");
    }

    function testTransferToken() public {
        string memory ipfsHash = "QmTransferHash";
        uint256 tokenId = nftCollection.mintToken(user, ipfsHash);

        // Approve the new owner to transfer the token
        address newOwner = address(0x456);
        vm.prank(user); // Set the next call to be from the user address
        nftCollection.approve(newOwner, tokenId);

        // Transfer the token to a different address
        vm.prank(newOwner); // Set the next call to be from the newOwner address
        nftCollection.safeTransferFrom(user, newOwner, tokenId, "");

        // Verify the new owner has the token
        uint256[] memory newOwnerTokens = nftCollection.getTokensOfOwner(
            newOwner
        );
        assertEq(newOwnerTokens.length, 2, "New owner should have the token");
        assertEq(
            newOwnerTokens[0],
            tokenId,
            "New owner's token ID should match the transferred token"
        );

        // Verify the previous owner no longer owns the token
        uint256[] memory userTokens = nftCollection.getTokensOfOwner(user);
        assertEq(
            userTokens.length,
            0,
            "Previous owner should not have the token after transfer"
        );
    }

    function testSupportsInterface() public view {
        // Test that the contract supports ERC721 and ERC721URIStorage interfaces
        assertTrue(
            nftCollection.supportsInterface(type(IERC721).interfaceId),
            "Should support ERC721 interface"
        );
        assertTrue(
            nftCollection.supportsInterface(type(IERC721Metadata).interfaceId),
            "Should support ERC721URIStorage interface"
        );
    }

    function testGetTokensOfOwner() public {
        string memory ipfsHash1 = "QmHash1";
        string memory ipfsHash2 = "QmHash2";

        uint256 tokenId1 = nftCollection.mintToken(user, ipfsHash1);
        uint256 tokenId2 = nftCollection.mintToken(user, ipfsHash2);

        uint256[] memory userTokens = nftCollection.getTokensOfOwner(user);

        // Verify the user owns both tokens
        assertEq(userTokens.length, 2, "User should own two tokens");
        assertEq(
            userTokens[0],
            tokenId1,
            "First token ID should match the first minted token"
        );
        assertEq(
            userTokens[1],
            tokenId2,
            "Second token ID should match the second minted token"
        );
    }
}
