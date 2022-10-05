import React, {useEffect,useState, useContext} from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } from "recharts";
import axios from 'axios';
import { TokenContext } from '../contexts/TokenContext';
import { LoggedInContext } from '../contexts/LoggedInContext';
import { UrlContext } from '../contexts/UrlContext';

import {hashFunction} from '../helperFunctions/HashFunctions.js'

export default function Chart() {

   const [waterState, setWaterState] = useState(null);
   const {Token, setToken} = useContext(TokenContext);
   const {LoggedIn, setLoggedIn} = useContext(LoggedInContext);
   const {url, setUrl} = useContext(UrlContext);

   var host = window.location.hostname; 

   useEffect(() => {
    fetchData(); 
   }, [])

   function fetchData() {
    axios.get(url+"/fetchData/chart", {
            params: {
                username: LoggedIn.username,
                token: hashFunction(Token)
            }
        }).then(res => {
            if(res.status === 200) {
              setWaterState(res.data.numberOfWaterings);
            }
        })
        .catch(function(error) {

        });
   }

//  <CartesianGrid stroke="#FFFFFF" />
  return (
    <div id ="chart">
        Charts
        <LineChart
            width={500}
            height={400}
           data={waterState}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
            <XAxis dataKey="date" stroke="#FFFFFF" />
            <YAxis stroke="#FFFFFF"/>
            <Tooltip />
            <Line type="monotone" dataKey="number" stroke="#FFFFFF" />
        </LineChart>
    </div>
  )
}
