import React, { useState, useEffect } from 'react'

import Login from './Login.js';
import Dashboard from './Dashboard.js';

//Contexts

import { LoggedInContext } from '../contexts/LoggedInContext.js';


export default function Main() {



  const [LoggedIn, setLoggedIn] = useState();
  const [LoginVisable, setLoginVisable] = useState("visible");
  const [showContent, setShowContent] = useState(null);
 
  useEffect(() => {
    
    if(LoggedIn) {
      setLoginVisable("hidden");
      setShowContent(<Dashboard/>);
    } else {
      setLoginVisable("visible");
      setShowContent(null);
    }
   
  }, [LoggedIn])
   
  


  return (
    <div>

      <LoggedInContext.Provider value = {{LoggedIn, setLoggedIn}}>
       
        <div style={{visibility: LoginVisable}}>
          <Login />
        </div>
        <div>
          {showContent}
        </div>
       

      </LoggedInContext.Provider>

    </div>
  )
}
