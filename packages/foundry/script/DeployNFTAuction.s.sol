//SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {NFTAuction} from "../contracts/NFTAuction.sol";
import "./DeployHelpers.s.sol";

contract DeployNFTAuction is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    NFTAuction nftAuctionContract = new NFTAuction(msg.sender, 10);
    console.logString(
      string.concat(
        "NFTAuction contract deployed at: ", vm.toString(address(nftAuctionContract))
      )
    );
  }
}