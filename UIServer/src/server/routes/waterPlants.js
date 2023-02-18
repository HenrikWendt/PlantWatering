var express = require("express");
var request = require("request");
var User = require("../models/User");
var router = express.Router();
var bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    var parameters = req.query;

    const nodes = ["1", "2", "3", "4", "5"];
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

        await Promise.all(
          nodes.map(async (node) => {
            await request(
              await wateringRequest(node),
              function (error, response) {
                console.log("B4!");
                if (response.statusCode !== 200) {
                  console.log("ERROR!");
                  listOfErrors.push(node);
                  wateringError = true;
                }
              }
            );
          })
        );
        /* for (let i = 0; i < nodes.length; i++) {
          request(await wateringRequest(nodes[i]), function (error, response) {
            console.log("B4!");
            if (response.statusCode !== 200) {
              console.log("ERROR!");
              listOfErrors.push(nodes[i]);
              wateringError = true;
            }
          });
        }*/
      } else {
        request(
          await wateringRequest(parameters.node),
          function (error, response) {
            if (response.statusCode === 200) {
              res.status(200).json({
                message: "Watering started!",
              });
            } else {
              res.status(400).json({
                message: "Something went wrong, no watering performed!",
              });
            }
          }
        );
      }
    } else {
      res.status(400).json({
        status: 400,
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
