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
              date: date,
              number: element.numberOfWaterings,
            };

            tempListOfWaterings.push(tempObject);
          });
          setWaterState(tempListOfWaterings);
        }
      })
      .catch(function (error) {});
  }

  function setSelected() {
    let temp = document.querySelector("#select").value;
    setNodeToShow(temp);
  }

  //  <CartesianGrid stroke="#FFFFFF" />
  return (
    <>
      <BrowserView>
        <div>
          <h2 id="chart">Number of waterings</h2>
          <div id="row">
            <select
              className="form-select form-select-sm"
              aria-label="Default select-sm example"
              id="select"
            >
              <option defaultValue>All</option>
              <option value="1">Node 1</option>
              <option value="2">Node 2</option>
              <option value="3">Node 3</option>
              <option value="4">Node 4</option>
              <option value="5">Node 5</option>
            </select>

            <button
              type="button"
              className="btn btn-dark btn-sm "
              id="button"
              onClick={() => setSelected()}
            >
              Show
            </button>
          </div>

          <LineChart
            width={500}
            height={400}
            data={waterState}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="date" stroke="#FFFFFF" />
            <YAxis dataKey="number" stroke="#FFFFFF" allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="number" stroke="#FFFFFF" />
          </LineChart>
        </div>
      </BrowserView>
      <MobileView>
        <div>
          <h2 id="chart">Number of waterings</h2>
          <div id="row">
            <select
              className="form-select form-select-sm"
              aria-label="Default select-sm example"
              id="select"
            >
              <option defaultValue>All</option>
              <option value="1">Node 1</option>
              <option value="2">Node 2</option>
              <option value="3">Node 3</option>
              <option value="4">Node 4</option>
              <option value="5">Node 5</option>
            </select>

            <button
              type="button"
              className="btn btn-dark btn-sm "
              id="button"
              onClick={() => setSelected()}
            >
              Show
            </button>
          </div>
          <LineChart
            width={400}
            height={270}
            data={waterState}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="date" stroke="#FFFFFF" />
            <YAxis dataKey="number" stroke="#FFFFFF" allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="number" stroke="#FFFFFF" />
          </LineChart>
        </div>
      </MobileView>
    </>
  );
}
