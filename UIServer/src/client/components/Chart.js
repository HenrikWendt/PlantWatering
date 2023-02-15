import React, { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import { TokenContext } from "../contexts/TokenContext";
import { LoggedInContext } from "../contexts/LoggedInContext";
import { UrlContext } from "../contexts/UrlContext";
import { hashFunction } from "../helperFunctions/HashFunctions.js";
import { BrowserView, MobileView } from "react-device-detect";
import Selector from "./Selector";

export default function Chart() {
  const [waterState, setWaterState] = useState(null);
  const { Token, setToken } = useContext(TokenContext);
  const { LoggedIn, setLoggedIn } = useContext(LoggedInContext);
  const { url, setUrl } = useContext(UrlContext);
  const [nodeToShow, setNodeToShow] = useState("All");

  useEffect(() => {
    fetchData();
  }, [nodeToShow]);

  function fetchData() {
    axios
      .get(url + "/fetchData/chart", {
        params: {
          username: LoggedIn.username,
          token: hashFunction(Token),
          node: nodeToShow,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          let tempListOfWaterings = [];
          res.data.data.forEach((element) => {
            const date =
              element.date.split("T")[0].split("-")[1] +
              "/" +
              element.date.split("T")[0].split("-")[2];
            let tempObject = {
              Date: date,
              Waterings: element.numberOfWaterings,
            };

            tempListOfWaterings.push(tempObject);
          });
          setWaterState(tempListOfWaterings);
        }
      })
      .catch(function (error) {});
  }

  function setSelected() {
    let temp = document.querySelector("#selectShow").value;
    setNodeToShow(temp);
  }

  //  <CartesianGrid stroke="#FFFFFF" />  <CartesianGrid strokeDasharray="3 3" />
  return (
    <>
      <BrowserView>
        <div>
          <h2 id="chart">Number of waterings this week</h2>
          <Selector
            propsFunction={setSelected}
            propsButtonName={"Show"}
            propsIdName={"selectShow"}
          />
          <LineChart
            width={500}
            height={400}
            data={waterState}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="Date" stroke="#FFFFFF" />
            <YAxis dataKey="Waterings" stroke="#FFFFFF" allowDecimals={false} />
            <Tooltip
              isAnimationActive={false}
              itemStyle={{ color: "white", backgroundColor: "transparent" }}
              contentStyle={{
                color: "transparent",
                backgroundColor: "transparent",
                borderRadius: 20,
              }}
              labelStyle={{
                color: "white",
                backgroundColor: "transparent",
              }}
              viewBox={{ color: "transparent" }}
            />
            <Line type="monotone" dataKey="Waterings" stroke="#FFFFFF" />
          </LineChart>
        </div>
      </BrowserView>
      <MobileView>
        <div>
          <h2 id="chart">Number of waterings</h2>
          <Selector
            propsFunction={setSelected}
            propsButtonName={"Show"}
            propsIdName={"selectShow"}
          />
          <LineChart
            width={400}
            height={270}
            data={waterState}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="Date" stroke="#FFFFFF" />
            <YAxis dataKey="Waterings" stroke="#FFFFFF" allowDecimals={false} />
            <Tooltip
              isAnimationActive={false}
              cursor={false}
              itemStyle={{ color: "white", backgroundColor: "transparent" }}
              contentStyle={{
                color: "transparent",
                backgroundColor: "transparent",
                borderRadius: 20,
              }}
              labelStyle={{
                color: "white",
                backgroundColor: "transparent",
              }}
            />
            <Line type="monotone" dataKey="Waterings" stroke="#FFFFFF" />
          </LineChart>
        </div>
      </MobileView>
    </>
  );
}
