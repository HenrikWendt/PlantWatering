import React, {useState,useContext} from 'react'
import '../App.css';
import axios from 'axios';
import Banner from '../components/Banner';
import {hashFunction} from '../helperFunctions/HashFunctions.js'
import {BrowserView, MobileView} from 'react-device-detect';

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
    <>
     <BrowserView>
        <div id="search-container">
            <div  id="Search">
                <Banner/>
                <div id="row">
                    <div class="input-group input-group-lg" id ="inpiutField-username">
                        <span class="input-group-text bg-dark text-white border-secondary" id="span-size" >Username</span>
                        <input name="username" type="text" class="form-control bg-dark text-white border-secondary" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" onChange={handleChange}/>
                    </div>
                </div>
                <div id="row">
                    <div class="input-group input-group-lg" id ="inpiutField-username">
                        <span class="input-group-text bg-dark text-white border-secondary" id="span-size">Password</span>
                        <input name="password" type="password" class="form-control bg-dark text-white border-secondary" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" onChange={handleChange}/>
                    </div>
                </div>
                <div id="row" style={{visibility: createAccount}} >
                    <div class="input-group input-group-lg" id ="inpiutField-username">
                        <span class="input-group-text bg-dark text-white border-secondary" id="span-size">Code</span>
                        <input name="code" type="password" class="form-control bg-dark text-white border-secondary" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" onChange={handleChange}/>
                    </div>
                </div>

                <div id="row">
                    <div class="d-grid gap-2 col-2 mx-auto">
                        <button type="button" class="btn btn-dark btn-lg " onClick={() => submitLogin()} >Login</button>
                    </div>
                </div>
                <div id="row">
                    <div class="d-grid gap-2 col-2 mx-auto">
                        <button type="button" class="btn btn-dark btn-lg " onClick={() => createAccountButton()} >Create Account</button>
                    </div>
                </div>
                <div id="row" >
                    <label > {createAccountStatus} </label>
                </div>
            </div>
        </div>
        </BrowserView>
        <MobileView>
        <div id="search-container">
            <div  id="Search">
                <Banner/>
                <div id="row">
                    <div class="input-group input-group-lg" >
                        <span class="input-group-text bg-dark text-white border-secondary" id="span-size" >Username</span>
                        <input name="username" type="text" class="form-control bg-dark text-white border-secondary" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" onChange={handleChange}/>
                    </div>
                </div>
                <div id="row">
                    <div class="input-group input-group-lg">
                        <span class="input-group-text bg-dark text-white border-secondary" id="span-size">Password</span>
                        <input name="password" type="password" class="form-control bg-dark text-white border-secondary" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" onChange={handleChange}/>
                    </div>
                </div>
                <div id="row" style={{visibility: createAccount}} >
                    <div class="input-group input-group-lg">
                        <span class="input-group-text bg-dark text-white border-secondary" id="span-size">Code</span>
                        <input name="code" type="password" class="form-control bg-dark text-white border-secondary" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" onChange={handleChange}/>
                    </div>
                </div>

                <div id="row">
                    <div class="">
                        <button type="button" class="btn btn-dark btn-lg " onClick={() => submitLogin()} >Login</button>
                    </div>
                </div>
                <div id="row">
                    <div class="">
                        <button type="button" class="btn btn-dark btn-lg " onClick={() => createAccountButton()} >Create Account</button>
                    </div>
                </div>
                <div id="row" >
                    <label > {createAccountStatus} </label>
                </div>
            </div>
        </div>
        </MobileView>
    </>
  )
}
