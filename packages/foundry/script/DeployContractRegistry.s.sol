//SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { ContractRegistry } from "../contracts/ContractRegistry.sol";
import "./DeployHelpers.s.sol";

contract DeployContractRegistry is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    ContractRegistry contractRegistryContract = new ContractRegistry();
    console.logString(
      string.concat(
        "ContractRegistry contract deployed at: ", vm.toString(address(contractRegistryContract))
      )
    );
  }
}