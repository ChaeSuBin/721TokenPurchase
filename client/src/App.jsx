/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import React, { createContext, useEffect, useReducer, useState} from "react";
import ERC721Contract from "./contracts/Broker.json";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Purchase } from './components/Purchase';
import Market from './components/Market';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Wallet from "./components/Wallet";
import getWeb3 from "./service/getWeb3";

const app=css`
  height: 100vh;
`

const initialState = null

export const WebDispatch = createContext({});

const reducer = (state, action) =>{
    switch (action.type) {
        case 'setMethod':
            return{
                ...state,
                methods: action.methods
            };
        case 'setAccount':
            return {
                ...state,
                accounts: action.accounts
            }
        default:
            return state;
    }
}

const App = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch}
    const [accounts, setAccounts] = useState();
    const [contract, setContract] = useState();
    //const [BroContract, setBroContract] = useState();

    useEffect(()=>{
        const isLogin = localStorage.getItem("isLogin");
        isLogin && connectWeb3();

    },[])
    const connectWeb3 =async ()=>{
        try{
            const web = await getWeb3();
            const accounts = await web.eth.getAccounts();
            const networkId = await web.eth.net.getId();
            const deployedNetwork = ERC721Contract.networks[networkId];
            const contract = await new web.eth.Contract(
                ERC721Contract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            setAccounts(accounts);
            setContract(contract);

            localStorage.setItem("isLogin", "true");
            dispatch({type : 'setMethod', methods: contract.methods})
            dispatch({type : 'setAccount', accounts: accounts})
        }catch(error){
            console.log(error);
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
        }
    }

    const handleWeb = () =>{
        connectWeb3();
    }
    return(
        <div css={app} className="App">
            <WebDispatch.Provider value={value}>
            <Router>
                <Switch>
                        <Layout>
                            <Route exact path="/market" render ={
                                props =>  <Market {...props}/>}>
                            </Route>
                            <Route exact path="/profile" render={
                                props => <Profile {...props} accounts={accounts} contract={contract}/>} />
                            <Route exact path='/wallet' render={
                                props => <Wallet {...props} handleWeb={handleWeb}/>} />
                            <Route exact path="/purchase" render={
                                props => <Purchase {...props} accounts={accounts} contract={contract}/>} />
                        </Layout>
                </Switch>
            </Router>
            </WebDispatch.Provider>
        </div>
    )
}

export default App;