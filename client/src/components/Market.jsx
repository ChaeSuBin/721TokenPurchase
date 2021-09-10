
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import {WebDispatch} from "../App";
import {useContext, useEffect, useState} from "react";

const market= css`
	width: 66%;
	height: 100%;
	background-color: white;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
`
const asset = css`
	list-style: none;
	width: 230px;
	height: 350px;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
	img{
		object-fit: contain;
		width: 100%;
	}
`

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('5525ab8719643b41b926', '33b8375ca30a5f75d30cba0cb97730da3459fa0be8226dc51c7171fcc7226e12');
const baseURL='https://gateway.pinata.cloud/ipfs/';

const filter = {
	status: 'pinned',
	// metadata: {
	// 	keyvalues: {
	// 		type: {
	// 			value: 'show',
	// 			op: 'eq'
	// 		}
	// 	}
	// }
}

const Market = ({history,accounts}) => {
	console.log(accounts);
	const {state, dispatch} = useContext(WebDispatch);
	const [assets, setAssets] = useState({});
	// const [assets, setAssets] = useState();
	//

	useEffect(() => {
		async function fetchPinned() {
			const tokens = await pinata.pinList(filter);
			console.log(tokens);
			setAssets(tokens.rows);
		}
		console.log(assets);
		fetchPinned();
	},[]);
	
	const onSubmit = async () => {
		const tokens = await pinata.pinList(filter);
		console.log(tokens)
		//state가 null일 경우에만 wallet으로 이동합니다.
		console.log(`state :${state}`)
		if(state){
			history.push("/profile")
		}else{
			history.push("/wallet");
		}
	}
	return (
		<div css={market}>
			<button onClick={onSubmit}>아이템 업로드하기</button>
			{/*{Object.keys(assets).map(key => ( */}
			{/*	<Asset asset={assets[key]}/>*/}
			{/*))}*/}
		</div>
	)

};

export default Market;

