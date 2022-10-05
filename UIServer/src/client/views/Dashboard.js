import React, { useContext, useState } from 'react'
import { LoggedInContext } from '../contexts/LoggedInContext';
import { TokenContext } from '../contexts/TokenContext';
import { UrlContext } from '../contexts/UrlContext';
import Chart from '../components/Chart';
import Status from '../components/Status';
import axios from 'axios';
import {hashFunction} from '../helperFunctions/HashFunctions.js'

export default function Dashboard() {

  const {LoggedIn, setLoggedIn} = useContext(LoggedInContext);
  const {Token, setToken} = useContext(TokenContext);
  const {url, setUrl} = useContext(UrlContext);

  const [wateringText, setWateringText] = useState(null);

  function logout() {
    setLoggedIn({status: false, username: "" });

    axios.delete(url+"/logout", {
      params: {
          username: LoggedIn.username,
          token: hashFunction(Token)
      }
    }).then(res => {
    
        if(res.status === 200) {
          window.sessionStorage.removeItem("user");
        }
    })
    .catch(function(error) {
      
    });
    
  }

  function waterPlants() {

    setWateringText("Loading...");

    axios.get(url+"/waterPlants", {
      params: {
          username: LoggedIn.username,
          token: hashFunction(Token)
      }
    }).then(res => {
    
        if(res.status === 200) {
         //watering successfull
        }else {
          //watering unsuccessfull
        }
        setWateringText(res.data.message);
    })
    .catch(function(error) {
      
    });
   
  }

  return (
    <div> 
       <div id = "title">Welcome {LoggedIn.username} 
        <button id = "logout-button" onClick={() => logout()}> Logout </button>
       </div>
       <div id = "bottom">
          <div id= "left">
            <Chart/>
          </div>
          <div id= "right">
            <Status/>
            <button id = "button" onClick={() => waterPlants()}> Water plant </button>
            <p id = "title"> {wateringText} </p>
          </div>
       </div>
    </div>
  )
}