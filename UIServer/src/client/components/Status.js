import React, {useEffect,useState,useContext} from 'react'
import axios from 'axios'
import {hashFunction} from '../helperFunctions/HashFunctions.js'

import { TokenContext } from '../contexts/TokenContext';
import { LoggedInContext } from '../contexts/LoggedInContext';

export default function Status() {

    var host = window.location.hostname; 

    const [waterStatus, setWaterStatus] = useState("Loading...");

    const {LoggedIn, setLoggedIn} = useContext(LoggedInContext);
    const {Token, setToken} = useContext(TokenContext);

    useEffect(() => {

        axios.get("http://"+ host +":9000/fetchData/status", {
            params: {
                username: LoggedIn.username,
                token: hashFunction(Token)
            }
        }).then(res => {
            if(res.status === 200) {
                
                setWaterStatus(res.data.wateringStatus);
            }else{

            }
        })
        .catch(function(error) {

        });


    }, [])
    

  return (
    <div id = "text" className="font-link">
      <h2>Status: {waterStatus}</h2>
    </div>
  )
}

