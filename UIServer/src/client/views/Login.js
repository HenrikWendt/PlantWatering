import React, {useState,useContext} from 'react'
import '../App.css';
import axios from 'axios';
import Banner from '../components/Banner';
import {hashFunction} from '../helperFunctions/HashFunctions.js'

//Contexts
import { LoggedInContext } from '../contexts/LoggedInContext';
import { TokenContext } from '../contexts/TokenContext';
import { UrlContext } from '../contexts/UrlContext';



export default function Search() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("null");
    const [code, setCode] = useState("");
    const [createAccount, setCreateAccount] = useState("hidden");
    const [createAccountStatus, setCreateAccountStatus] = useState("");
   
    const {LoggedIn, setLoggedIn} = useContext(LoggedInContext);
    const {Token, setToken} = useContext(TokenContext);
    const {url, setUrl} = useContext(UrlContext);
    //const salt = bcrypt.genSaltSync(10)

    function submitLogin() {
        
        axios.get(url+"/login", {
            params: {
                username: username,
                password: hashFunction(password),
            }
        }).then(res => {
        
            if(res.status === 200) {
                setCreateAccountStatus(res.data.message);  
                setLoggedIn({status: true, username: username });
                setToken(res.data.token);
                window.sessionStorage.setItem("user", JSON.stringify({"username": username, "token": res.data.token}));
            }
        })
        .catch(function(error) {
            setCreateAccountStatus(error.response.data.message);   
            setLoggedIn({status: false, username: "" });     
        });
    }   

    function createAccountButton() {
      
        if(createAccount === "hidden") {
            setCreateAccount("visible");
        }else {
          
            axios.post(url+"/createAccount", {
            params: {
                username: username,
                password: hashFunction(password),
                code: hashFunction(code)
            }
            })
            .then(res => {
                setCreateAccountStatus(res.data.message);
                if(res.status === 200) {
                    setCreateAccount("hidden");
                }
            })
            .catch(function(error) {
                setCreateAccountStatus(error.response.data.message);
                
            });
        }
    }

    function handleChange(e) {
        if(e.target.name === "username") {
            setUsername(e.target.value);
        }else if (e.target.name === "password") {
            setPassword(e.target.value);
        }else if (e.target.name === "code") {
            setCode(e.target.value);
        }
    }

  return (
    
    <div  id="Search">

        <Banner/>
        
        <div id="row">
            <label>Enter username: </label>
        </div>
        <div id="row">
            <input type="text" id= "inpiutField-username"  name="username" onChange={handleChange}/> 
        </div>
         <div id="row">
            <label>Enter password: </label>
        </div>
        <div id="row">
            <input type="password" id="inpiutField-username" name="password"  onChange={handleChange}/>
        </div>
        <div id="row" style={{visibility: createAccount}} >
            <label >Enter Secret Code: </label>
        </div>
        <div id="row" style={{visibility: createAccount}} >
            <input  type="password" id="inpiutField-username" name="code"  onChange={handleChange}/>
        </div>

        <div id="row">
             <button name="loginButton" id="button" onClick={() => submitLogin()}> Login</button>
        </div>
        <div id="row">
            <button name="createAccountButton" id="button" onClick={() => createAccountButton()}> Create Account</button>
        </div>
        <div id="row" >
            <label > {createAccountStatus} </label>
        </div>
    </div>
  )
}
