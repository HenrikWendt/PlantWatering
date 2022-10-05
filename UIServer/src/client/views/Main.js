import React, { useState, useEffect } from 'react'

import Login from './Login.js';
import Dashboard from './Dashboard.js';
import axios from 'axios';
import {hashFunction} from '../helperFunctions/HashFunctions.js'

//Contexts
import { LoggedInContext } from '../contexts/LoggedInContext.js';
import { TokenContext } from '../contexts/TokenContext.js';
import { UrlContext } from '../contexts/UrlContext.js'; 


export default function Main() {

  const [LoggedIn, setLoggedIn] = useState({status: false, username: "" });
  const [Token, setToken] = useState();
  const [url, setUrl] = useState("http://"+ window.location.hostname +":9000");
  const [LoginVisable, setLoginVisable] = useState(null);
  const [showContent, setShowContent] = useState(null);
  var host = window.location.hostname; 
 
  useEffect(() => {
    
    if(LoggedIn.status) {
      setLoginVisable(null);
      setShowContent(<Dashboard />);
    } else {
      setLoginVisable(<Login/>);
      setShowContent(null);
    }
   
  }, [LoggedIn])


  


  const pageAccessedByReload = (
    window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.type)
        .includes('reload')
  );

  useEffect(() => {

    //Behöver fixa så att username och token sparas när man reloadar!
    
    if(pageAccessedByReload && window.sessionStorage.getItem("user") !== null ) {

      axios.get("http://"+ host +":9000/login", {
            params: {
                username: JSON.parse(window.sessionStorage.getItem("user")).username,
                token: hashFunction(JSON.parse(window.sessionStorage.getItem("user")).token)
            }
        }).then(res => {
        
            if(res.status === 200) {
                setLoggedIn({status: true, username: JSON.parse(window.sessionStorage.getItem("user")).username });
                setToken(res.data.token);
            }
        })
        .catch(function(error) {

            setLoggedIn({status: false, username: "" });     
        });
      
    }
   
    
  }, [pageAccessedByReload])
   
  
  return (
    <div>
      <UrlContext.Provider value = {{url, setUrl}}>
      <TokenContext.Provider value = {{Token, setToken}}> 
      <LoggedInContext.Provider value = {{LoggedIn, setLoggedIn}}>
       
        <div>
          {LoginVisable}
        </div>
        <div>
          {showContent}
        </div>
       

      </LoggedInContext.Provider>
      </TokenContext.Provider>
      </UrlContext.Provider>
    </div>
  )
}
