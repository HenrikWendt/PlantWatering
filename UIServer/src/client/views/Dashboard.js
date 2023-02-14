import React, { useContext, useState } from "react";
import { LoggedInContext } from "../contexts/LoggedInContext";
import { TokenContext } from "../contexts/TokenContext";
import { UrlContext } from "../contexts/UrlContext";
import Chart from "../components/Chart";
import Status from "../components/Status";
import axios from "axios";
import { hashFunction } from "../helperFunctions/HashFunctions.js";
import { BrowserView, MobileView } from "react-device-detect";

export default function Dashboard() {
  const { LoggedIn, setLoggedIn } = useContext(LoggedInContext);
  const { Token, setToken } = useContext(TokenContext);
  const { url, setUrl } = useContext(UrlContext);

  const [wateringText, setWateringText] = useState(null);

  function logout() {
    setLoggedIn({ status: false, username: "" });

    axios
      .delete(url + "/logout", {
        params: {
          username: LoggedIn.username,
          token: hashFunction(Token),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          window.sessionStorage.removeItem("user");
        }
      })
      .catch(function (error) {});
  }

  function waterPlants() {
    setWateringText("Loading...");

    axios
      .get(url + "/waterPlants", {
        params: {
          username: LoggedIn.username,
          token: hashFunction(Token),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          //watering successfull
        } else {
          //watering unsuccessfull
        }
        setWateringText(res.data.message);
      })
      .catch(function (error) {});
  }

  return (
    <>
      <BrowserView>
        <div>
          <div id="title">
            Welcome {LoggedIn.username}
            <button
              type="button"
              className="btn btn-dark"
              id="logout-button"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
          <div id="bottom">
            <div id="left">
              <div id="right-box">
                <Chart />
              </div>
            </div>
            <div id="right">
              <div id="right-box">
                <Status />
                <button
                  type="button"
                  className="btn btn-dark btn-lg "
                  id="water-button"
                  onClick={() => waterPlants()}
                >
                  Water plant
                </button>
                <p id="text"> {wateringText} </p>
              </div>
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div>
          <div id="title-mobile">
            Welcome {LoggedIn.username}
            <button
              type="button"
              className="btn btn-dark"
              id="logout-button"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
          <div id="dashbord-mobile">
            <Chart />
            <Status />
            <button
              type="button"
              className="btn btn-dark btn-lg "
              id="water-button"
              onClick={() => waterPlants()}
            >
              Water plant
            </button>
            <div id="text">
              <h2> {wateringText} </h2>
            </div>
          </div>
        </div>
      </MobileView>
    </>
  );
}
