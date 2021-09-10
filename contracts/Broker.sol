// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Token721.sol';

contract Broker is Token721 {
    
    event NftBought(address _seller, address _buyer, uint256 _price);
    
    uint256 commision = 2;
    address seller;
    address owner = 0xfeA4b91Ba33AF2312bd39F0B21d094A54a7Bc0e7;

    mapping (uint256 => uint256) public tokenIdToPrice;
    
    mapping(address => uint256) balances;
    
    modifier fee(uint _fee) {
        if (balances[msg.sender] != _fee) {
            revert("Incorrect value");
        } else {
            _;
        }
    }
    
    modifier bySeller(address _tokenOwn) {
        require (msg.sender == _tokenOwn, 'Not owner of this token');
        _;
    }
    
    modifier onlyOwner() {
        require (msg.sender == owner, 'Not owner of this contract');
        _;
    }
    
    //owner-------------------------
    
    function setCommision(uint _rate) external onlyOwner{
        commision = _rate;
    }
    function commisionRate() external view returns(uint256){
        return commision;
    }
    function getContractBalance() public view returns (uint){
        return address(this).balance;
    }
    function getContractAddress() external view returns (address){
        return address(this);
    }
    function fCommision(uint256 buyerVal) internal view returns (uint256)
    {
        uint256 vCommision = (buyerVal / commision);
        return vCommision;
    }
    function withdraw() external payable onlyOwner
    {
        (bool success, bytes memory data) = payable(owner).call{value: getContractBalance()}("");
        require(success, "failed to sent");
    }
    //-------------------------owner
    
    function beginSale(uint256 _tokenId, uint256 _price)
    external
    bySeller(ownerOf(_tokenId))
    {
        require(_price > 0, 'Price zero');
        tokenIdToPrice[_tokenId] = _price * (10**18);
    }

    function closeSale(uint256 _tokenId) external bySeller(ownerOf(_tokenId)){
        tokenIdToPrice[_tokenId] = 0;
    }
    
    function buy(uint256 _tokenId)
    external
    payable
    {
        balances[msg.sender] += msg.value;
        allowTransfer(_tokenId);
        
        uint256 sendEth = fCommision(msg.value);
        payable(seller).transfer(msg.value - sendEth);

        emit NftBought(seller, msg.sender, msg.value);
    }
    
    function allowTransfer(uint256 _tokenId)
    internal
    fee(tokenIdToPrice[_tokenId])
    {
        uint256 price = tokenIdToPrice[_tokenId];
        require(price > 0, 'This token is not for sale');
        
        seller = ownerOf(_tokenId);
        _transfer(seller, msg.sender, _tokenId);
        tokenIdToPrice[_tokenId] = 0;
        balances[msg.sender] -= tokenIdToPrice[_tokenId];
    }
}