// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import './interface/IFactoryItem.sol';
import './BasicERC721.sol';

contract NftFactoryItemERC721 is IFactoryItem{
     
    function spawnNft(
        string calldata name,
        string calldata symbol,
        string calldata uri,
        bytes calldata
    )external returns(address){
        BasicERC721 nftToken = new BasicERC721(name,symbol,uri);
        return address(nftToken);
    }
 }