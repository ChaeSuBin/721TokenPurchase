import React, { useState, useContext, useRef } from 'react';
import {WebDispatch} from "../App";

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('5525ab8719643b41b926', '33b8375ca30a5f75d30cba0cb97730da3459fa0be8226dc51c7171fcc7226e12');
// const baseURL='https://gateway.pinata.cloud/ipfs/';
const { create } = require('ipfs-http-client');
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });


const AssetAddForm = ({contract, accounts}) => {
	console.log(contract, accounts);
	const [audioBuffer, setAudioBuffer] = useState();
	const [imageBuffer, setImageBuffer] = useState();
	const {state, dispatch} = useContext(WebDispatch);

	const titleRef= useRef();
	const authorRef = useRef();
	const descriptionRef= useRef();
	const priceRef= useRef();



	const audioCapture = (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		const reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => {
			setAudioBuffer(Buffer(reader.result));
		}
	}

	const imageCapture = (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		const reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => {
			setImageBuffer(Buffer(reader.result));
		}
	}

	const createToken = async (event) => {
		//contract, accounts가져오기
		// const { accounts, contract } = state;

		//ipfs에 저장
		const asset = {
			audio: audioBuffer,
			image: imageBuffer,
		}
		const result = await ipfs.add(JSON.stringify(asset));
		console.log(`path :${result.path}`)

		const options={
			pinataMetadata: {
				name: titleRef.current.value || '',
				keyvalues: {
					author: authorRef.current.value || '',
					description : descriptionRef.current.value || '',
					price : priceRef.current.value || '',
				}
			}
		}
		//pinning
		const pinataResult = await pinata.pinByHash(result.path, options);

		//nft mint
		const nft = await contract.methods.mintToken(accounts[0], pinataResult.ipfsHash).send({ from: accounts[0] });
		console.log(nft)
	};
	return (
		<form>
			<input ref={titleRef} type="text" id="setTitle" placeholder="Title"/>
			<input ref={authorRef} tpye="text" id="setAuthor" placeholder="Author"/>
			<input ref={descriptionRef} type="text" id="setDescription" placeholder="description"/>
			<input ref={priceRef} type="text" id="setPrice" placeholder="price"/>
			<input type="file" id="setAudio" onChange={audioCapture}/>
			<input type="file" id="setImage" onChange={imageCapture}/>
			<input type="button" id="create" value="create" onClick={createToken}/>
		</form>
	)
}

export default AssetAddForm;