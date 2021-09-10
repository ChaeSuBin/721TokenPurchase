import React, { useState, useRef } from "react";

export const Purchase = ({contract, accounts}) => {
    //console.log('c: ', contract, accounts);
    
    const [text, setText] = useState('');
    const [tokenIdRef, setId] = useState('');
    const [tokenUriRef, setUri] = useState('');
    const [tokenPriceRef, setPrice] = useState('');
    
    const handleChange = (e) => {
        e.persist();
        setText(() => e.target.value);
    }

    const testMint = async () =>{
        const nft = await contract.methods.mintToken(
            accounts[0], tokenUriRef).send({ from: accounts[0] });
        console.log(nft);
    }

    const ownerOf = async () =>{
        const _tokenOwn = await contract.methods.ownerOf(text).call();
        console.log(_tokenOwn);
    }

    const totalSupply = async () =>{
        const tokenBlc = await contract.methods.totalSupply().call();
        console.log(tokenBlc);
    }

    const tokenURI = async () =>{
        //const tokenURI = await contract.methods.tokenURI(tokenIdRef.current.value).call();
        const tokenURI = await contract.methods.tokenURI(tokenIdRef).call();
        console.log(tokenURI);
    }

    const beginSale = async () =>{
        const setPrice = await contract.methods.beginSale(
            tokenIdRef, tokenPriceRef).send({ from: accounts[0] });
        console.log('begin Sale');
    }

    const closeSale = async () =>{
        await contract.methods.closeSale(tokenIdRef).send({ from: accounts[0] });
        console.log('sale Closed');
    }

    const availableToken = async () => {
        const avalTokenArr = ['tokenId'];
        const tokenBlc = await contract.methods.totalSupply().call();
        for (let itrTokenId = 1; itrTokenId < tokenBlc+1; itrTokenId++)
        {
            const tokenPrice = await contract.methods.tokenIdToPrice(itrTokenId).call()
            if(tokenPrice != 0){
                avalTokenArr.push(itrTokenId);
            }
        }
        console.log(avalTokenArr);
    }

    const tokenBuy = async () =>{
        const tokenPrice = await contract.methods.tokenIdToPrice(tokenIdRef).call();
        await contract.methods.buy(tokenIdRef).send({
            from: accounts[0],
            gas: 3000000,
            value: tokenPrice
        })
    }
    const caBalance = async () => {
        const balance = await contract.methods.getContractBalance().call();
        console.log(balance+' wei');
    }

    const withdrawFrom = async () => {
        await contract.methods.withdraw().send({ from: accounts[0] });
        console.log('done');
    }

    return (
    <>
        <p>demo : demo{text}</p>
        <p>
            <input onChange={event => setUri(event.target.value)} type="text" placeholder="tokenURI" />
            <button onClick={ testMint }>tokenMint</button></p>
        <p>
            <input value={text} onChange={handleChange} type="text" placeholder="tokenId" />
            <button onClick={ ownerOf }>tokenOwn</button></p>
        <p>
            <button onClick={ totalSupply }>tokenBlc</button></p>
        <p>
            <input onChange={event => setId(event.target.value)} type="text" placeholder="tokenId" />
            <button onClick={ tokenURI }>tokenURI</button></p>
        <p>
            <input onChange={event => setId(event.target.value)} type="text" placeholder="tokenId" />
            <input onChange={event => setPrice(event.target.value)} type="text" placeholder="tokenPrice" />
            <button onClick={ beginSale }>toknSail</button></p>
        <p>
            <input onChange={event => setId(event.target.value)} type="text" placeholder="tokenId" />
            <button onClick={ closeSale }>toknClose</button></p>
        <p>
            <button onClick={ availableToken }>available</button></p>
        <p>
            <input onChange={event => setId(event.target.value)} type="text" placeholder="tokenId" />
            <button onClick={ tokenBuy }>tokenBuy</button></p>
        <p>
            <button onClick={ caBalance }>CA_Balance</button></p>
        <p>
            <button onClick={ withdrawFrom }>withdraw</button>
        </p>
    </>
    );
}