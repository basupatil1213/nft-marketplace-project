//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {DeployContractRegistry} from "./DeployContractRegistry.s.sol";
import { DeployNFTCollection } from "./DeployNFTCollection.s.sol";
import {DeployNFTAuction} from "./DeployNFTAuction.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {


        // deploy NFTCollection contract
        DeployNFTCollection deployNFTCollection = new DeployNFTCollection();
        deployNFTCollection.run();
        
        // deploy ContractRegistry contract
        DeployContractRegistry deployContractRegistry = new DeployContractRegistry();
        deployContractRegistry.run();

        // deploy NFTAuction contract
        DeployNFTAuction deployNFTAuction = new DeployNFTAuction();
        deployNFTAuction.run();
    }
}
