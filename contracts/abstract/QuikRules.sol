// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

abstract contract QuikRules {

    
    modifier onlyIfPublicMintStatus(bool publicMintStatus) {
        require(
            publicMintStatus == true,
                'Error: Public minting is not available'
        );
        _;
    }

    modifier onlyTheContractOwner(address contractOwner) {
        require(
            msg.sender == contractOwner,
                'Error: Only the Owner can call this function.'
        );
        _;
    }

    modifier onlyIfOwnerOfNft(uint256 _tokenId, address _owner) {
        require(_owner == msg.sender, "Error: no token match for address");
        _;
    }

    function freezeMetadataURI(uint256 tokenId) virtual external;
    
}