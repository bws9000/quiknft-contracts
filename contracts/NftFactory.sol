// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import './interface/IFactoryItem.sol';

contract NftFactory {

    event NftSpawned(address newNft, address _owner);

    address[] public spawnedNftArray;
    mapping(address => bool) public spawnedNftMapping;

    function spawn(
        address nftToSpawn,
        string calldata name,
        string calldata symbol,
        string calldata uri,
        bytes calldata data
    ) external returns (address){

        address nft = IFactoryItem(nftToSpawn).spawnNft(
            name,
            symbol,
            uri,
            data
        );

        emit NftSpawned(nft, msg.sender);
        return nft;
    }

}