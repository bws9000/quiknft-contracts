// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../interface/IQUIK.sol";
import "../abstract/QuikRules.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
* @title QuikOne
* @author snyder.burt@gmail.com and @OZ
* @notice ERC721 IQUIK, ERC721, IERC2981
* @dev ERC721 contract extending OZ ERC721
*/
contract QuikOne is ERC721, IERC2981, ERC721Enumerable, 
QuikRules, IQUIK  {
    
    using Counters for Counters.Counter;
    
    using Address for address;
    using Strings for uint256;

    event UpdatedMintStatus( bool oldValue, bool newValue );
    event UpdateRoyaltyAmount (uint256 oldValue, uint256 newValue);
    event UpdateDefaultBaseURI ( string oldValue, string newValue);
    event UpdateNftTokenURI ( string oldValue, string newValue);

    Counters.Counter public _tokenIdTracker;

    uint256 public royalty;
    bool internal publicMintStatus;
    string internal defaultBaseURI;
    address internal contractOwner;

    mapping(uint256 => bool) public metadataFrozenURI;
    mapping(uint256 => string) private _individualNftTokenURIs;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri) 
        ERC721(_name,_symbol) {
            defaultBaseURI = _uri;
            contractOwner = msg.sender;
        }

    /**
    *
    * @inheritdoc IQUIK
    * @dev freeze metadata
    */
    function setRoyaltyAmount(uint256 _amount) 
    external onlyTheContractOwner(contractOwner) {
        emit UpdateRoyaltyAmount(royalty,_amount);
        royalty = _amount;
    }

    /**
    *
    * @inheritdoc IQUIK
    * @dev freeze metadata
    */
    function setDefaultBaseURI(string calldata _uri) 
    external onlyTheContractOwner(contractOwner) {
        emit UpdateDefaultBaseURI(defaultBaseURI, _uri);
        defaultBaseURI = _uri;
    }

    /**
    *
    * @inheritdoc IQUIK
    * @dev _safeMint one ERC721 only by owner
    */
    function mintOneNftByOwner() 
    external onlyTheContractOwner(contractOwner) {
        _safeMint(msg.sender, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    /**
    *
    * @inheritdoc IQUIK
    * @dev public _safeMint one ERC721
    */
    function mintOneNft() external virtual {
        require(false,'Error: No public minting available for QuikOne');
    }

    /**
    *
    * @inheritdoc IQUIK
    * @dev allow the public to mint one ERC721
    */
    function setPublicMintStatus(bool _mintStatus) 
    external onlyTheContractOwner(contractOwner) {
        emit UpdatedMintStatus( publicMintStatus, _mintStatus );
        publicMintStatus = _mintStatus;
    }

    /**
    *
    * @inheritdoc IQUIK
    * @dev freeze metadata uri - can't be reversed only
    * by token (minted nft) owner
    */
    function freezeMetadataURI(uint256 tokenId) 
    external onlyIfOwnerOfNft(tokenId, ownerOf(tokenId)) {
        address tokenOwner = ownerOf(tokenId);
        require(tokenOwner == msg.sender, 
        "Error: no token match for address");
        metadataFrozenURI[tokenId] = true;
    }
    
    /**
    *
    * @dev https://eips.ethereum.org/EIPS/eip-2981
    *
    */
    function royaltyInfo(
        uint256 _tokenId,
        uint256 _salePrice
        )external view returns (
            address receiver, uint256 royaltyAmount
        ){
            uint256 tmpAmount = ( 1000000 * _salePrice ) + _tokenId;
            address tmpAddress = contractOwner;
            return (tmpAddress, tmpAmount);
        }

    /**
    * @notice
    * @param
    * @param
    * @return bool
    * @dev https://eips.ethereum.org/EIPS/eip-2981
    *
    */
    // function supportsInterface (bytes4 interfaceId)
    // public 
    // view 
    // virtual 
    // override(ERC721,IERC165,ERC721Enumerable) returns (bool){
    //     return interfaceId == type(IERC2981).interfaceId ||
    //     super.supportsInterface(interfaceId);
    // }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
    *
    * @inheritdoc ERC721
    * @dev if individual tokenURI not set return base + tokenId or
    * return an empty string ; overrides tokenURI
    */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "QuikNft: URI query for nonexistent token");

        if (bytes(_individualNftTokenURIs[tokenId]).length != 0) {
            return _individualNftTokenURIs[tokenId];
        }

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    /**
    *
    * @inheritdoc IQUIK
    * @dev if I own this nft I should be able to set the the URI no? ... yes,
    * but only if I've set my own URI and I'm not using the defaut base URI
    * established by the contract owner/deployer
    */
    function setTokenURI(uint256 tokenId, string memory _tokenURI) 
    external virtual onlyIfOwnerOfNft(tokenId, ownerOf(tokenId)) {
        require(_exists(tokenId), 
        "Error: URI set of nonexistent token");

        require(!metadataFrozenURI[tokenId], 
        "Error: URI Frozen; cannot update");

        require(bytes(_individualNftTokenURIs[tokenId]).length != 0,
        "Error: You have to set your own URI to freeze it");

        emit UpdateNftTokenURI(_individualNftTokenURIs[tokenId], _tokenURI);
        _individualNftTokenURIs[tokenId] = _tokenURI;
    }

    /**
    *
    * @inheritdoc ERC721
    * @dev burn token id remove; individual token uri if set
    */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_individualNftTokenURIs[tokenId]).length != 0) {
            delete _individualNftTokenURIs[tokenId];
        }
    }

    /**
    *
    * @inheritdoc ERC721
    * @dev return defaultBaseURI
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return defaultBaseURI;
    }

    /**
    *
    * @dev get my public mint status
    */
    function getPublicMintStatus() external view returns(bool){
        return publicMintStatus;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
}