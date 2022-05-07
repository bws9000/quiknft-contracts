// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import './interface/IFactoryItem.sol';
import './QuikOne.sol';

contract NftFactoryItem is IFACTORYITEM{
     
    function spawnNft(
        string calldata name,
        string calldata symbol,
        string calldata uri,
        bytes calldata
    )external returns(address){
        QuikOne nftToken = new QuikOne(name,symbol,uri);
        return address(nftToken);
    }
 }