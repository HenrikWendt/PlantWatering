var express = require("express");
var request = require("request");
var User = require("../models/User");
var router = express.Router();
var bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    var parameters = req.query;

    const nodes = ["1", "2", "3", "4", "5"];
    const requestsReceived = [];
    const listOfErrors = [];
    const user = await User.findOne({ username: parameters.username }).exec();
    if (
      user !== null &&
      parameters.token !== "null" &&
      bcrypt.compareSync(user.token, parameters.token)
    ) {
      console.log("Preparing watering!");

      if (parameters.node === "All") {
        let wateringError = false;
        nodes.map(async (node) => {
          request(
           await wateringRequest(node),
            function (error, response) {
              if(response) { 
                //Succesful
                if (response.statusCode === 200) {
                }else {
                  //Error
                  listOfErrors.push(node);
                  wateringError = true;
                }
              }
              if(error) {
                //Error
                listOfErrors.push(node);
                wateringError = true;
              }
              responseFunction(node);
            }
          )
        })
        function responseFunction (node) {
          requestsReceived.push(node);
          if(requestsReceived.length === nodes.length) {
          if (wateringError) {
            res.status(500).json({
              errorList: listOfErrors
            });
          } else {
            res.status(200).json({
              message: "Watering started on all nodes!",
            });
          }
          }
        }
      } else {
        request(
          await wateringRequest(parameters.node),
          function (error, response) {
            if (response.statusCode === 200) {
              res.status(200).json({
                message: "Watering started!",
              });
            } else {
              res.status(500).json({
                message: "Something went wrong, no watering performed!",
              });
            }
          }
        );
      }
    } else {
      res.status(401).json({
        status: 401,
        message: "Not authorized!",
      });
    }
  } catch (err) {
    console.log("error   " + err);
  }
  async function wateringRequest(node) {
    let data = {
      password: "something",
      amount: 1,
    };
    var requestWatering = {
      uri: "https://99fd5ed6-ae9d-4e8b-8775-02d4bc0ee493.mock.pstmn.io/waterPlants", //{node} lägg till här vilken det ska till
      body: JSON.stringify(data),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return requestWatering;
  }
});

module.exports = router;
