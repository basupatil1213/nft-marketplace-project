// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ContractRegistry {
    struct CollectionInfo {
        string name;
        string symbol;
        address owner;
    }
    address[] public allCollections;
    mapping(address => address[]) private ownerToCollections;
    mapping(address => CollectionInfo) private collectionMetadata;

    event CollectionRegistered(address indexed collection, address indexed owner, string name, string symbol);

    /**
     * @dev Registers a new collection with the registry.
     * @param collection The address of the collection contract.
     * @param owner The address of the owner of the collection.
     * @param name The name of the collection.
     * @param symbol The symbol of the collection.
     */
    function registerCollection(address collection, address owner, string memory name, string memory symbol) external {
        require(collection != address(0), "Collection address cannot be zero");
        require(owner != address(0), "Owner address cannot be zero");
        require(bytes(name).length > 0, "Collection name cannot be empty");
        require(bytes(symbol).length > 0, "Collection symbol cannot be empty");

        allCollections.push(collection);
        ownerToCollections[owner].push(collection);
        collectionMetadata[collection] = CollectionInfo({ name: name, symbol: symbol, owner: owner });
        emit CollectionRegistered(collection, owner, name, symbol);
    }

    /**
     * @dev Returns all registered collections.
     * @return An array of all collection addresses.
     */
    function getAllCollections() external view returns (address[] memory) {
        return allCollections;
    }

    /**
     * @dev Returns collections owned by a specific owner.
     * @param owner The address of the owner.
     * @return An array of collection addresses owned by the owner.
     */
    function getCollectionsByOwner(address owner) external view returns (address[] memory) {
        return ownerToCollections[owner];
    }

    /**
     * @dev Returns metadata of a specific collection.
     * @param collection The address of the collection.
     * @return The metadata of the collection.
     */
    function getCollectionMetadata(address collection) external view returns (CollectionInfo memory) {
        return collectionMetadata[collection];
    }
}