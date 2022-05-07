// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./QuikOne.sol";

/**
* @title QuikTwo
* @author snyder.burt@gmail.com
* @notice QuikOne
* @dev QuikTwo contract extending QuikOne
*/
contract QuikTwo is QuikOne {
    using Counters for Counters.Counter;

    constructor(
    string memory _name,
    string memory _symbol,
    string memory _uri) 
    QuikOne(_name,_symbol,_uri) {
        defaultBaseURI = _uri;
        contractOwner = msg.sender;
    }

    function mintOneNft() external override 
    onlyIfPublicMintStatus(publicMintStatus) {
        _safeMint(msg.sender, Counters.current(_tokenIds));
        Counters.increment(_tokenIds);
    }
    
}