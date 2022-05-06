// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BasicERC721 is ERC721 {

    event UpdatedMintStatus( bool oldValue, bool newValue );
    
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string private baseUri;
    address public owner;
    bool public publicMintStatus;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri) 
        ERC721(_name,_symbol) {
            baseUri = _uri;
            owner = msg.sender;
        }

    function mintOneNftByOwner() external onlyTheOwner {
        _safeMint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }

    function mintOneNft() external onlyIfPublicMintStatus {
        _safeMint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }

    function setPublicMintStatus(bool _mintStatus) external onlyTheOwner {
        emit UpdatedMintStatus( publicMintStatus, _mintStatus );
        publicMintStatus = _mintStatus;
    }

    /**
    * 
    *
    * add our own modifier similiar to 
    * OZ "onlyOwner" modifier
    *
    */
    modifier onlyTheOwner {
        require(
            msg.sender == owner,
                'Only the Owner can call this function.'
        );
        _;
    }


    /**
    *
    *
    * another modifier to prevent public minting if
    * if not allowed
    */
    modifier onlyIfPublicMintStatus {
        require(
            publicMintStatus == true,
                'Public minting is not available at this time'
        );
        _;
    }
    
}