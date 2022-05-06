// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

 interface IFactoryItem{

    function spawnNft(
        string calldata name,
        string calldata symbol,
        string calldata uri,
        bytes calldata data
    )external returns(address);
 }
