// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../client/node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '../client/node_modules/openzeppelin-solidity/contracts/utils/Counters.sol';

contract Token721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor() ERC721("Try4DeployTest721Ropsten", "DTRE") {
        //_setBaseURI("ipfs://");
    }

    function mintToken(address owner, string memory tokenURI)
        external
        virtual
        returns (uint256)
    {
        require(owner != address(0), "ERC721: mint to the zero address");
        require(msg.sender == owner);
        
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();
        _mint(owner, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
    
    function totalSupply() public view returns(uint256)
    {
        //return numberOfamount;
        return _tokenIds.current();
    }
}