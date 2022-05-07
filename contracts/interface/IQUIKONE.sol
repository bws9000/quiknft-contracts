// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IQUIKONE {

    function freezeMetadataURI(uint256 tokenId) external;

    function setRoyaltyAmount(uint256 _amount) external;

    function setDefaultBaseURI(string calldata uri) external;
    function setTokenURI(uint256 tokenId, string memory _tokenURI) external;

    function setPublicMintStatus(bool _mintStatus) external;
    function mintOneNftByOwner() external;
    function mintOneNft() external;

}