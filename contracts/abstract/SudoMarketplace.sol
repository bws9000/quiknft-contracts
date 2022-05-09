// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

abstract contract SudoMarketplace {

    event ItemDelisted(uint256 oldValue, uint256 newValue);

    mapping(uint256 => uint256) public saleItems;
    
    function setTokenPrice(uint256 tokenId, uint256 tokenPrice) virtual external;
    
    function listTokensForSale() virtual external;

    function deListItemForSale(uint256 tokenId) internal {
        require(saleItems[tokenId] == 0, "Error: Token not listed for sale");
        emit ItemDelisted(saleItems[tokenId], 0);
        saleItems[tokenId] = 0;
    }

}
