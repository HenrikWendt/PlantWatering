var express = require("express");
var request = require("request");
var User = require("../models/User");
var Data = require("../models/Data");
var router = express.Router();
var bcrypt = require("bcryptjs");

/* GET home page. */

const dataPassword = "1uy23g124kjbacAWD/&Da2he12!?";
router.get("/chart", async (req, res) => {
  try {
    var parameters = req.query;

    const user = await User.findOne({ username: parameters.username }).exec();
    if (
      user !== null &&
      parameters.token !== "null" &&
      bcrypt.compareSync(user.token, parameters.token)
    ) {
      //const data = await Data.findOne({ name: "wateringData" }).exec();

      let data = null;
      if (parameters.node === "All") {
        const listOfDates = await calculateDates();
        let tempData = await Data.find().where("date").in(listOfDates).exec();

        let mapOfDates = new Map();

        tempData.forEach((element) => {
          if (mapOfDates.has(element.date.toJSON().slice(0, 10))) {
            mapOfDates.get(
              element.date.toJSON().slice(0, 10)
            ).numberOfWaterings =
              mapOfDates.get(element.date.toJSON().slice(0, 10))
                .numberOfWaterings + element.numberOfWaterings;
          } else {
            mapOfDates.set(element.date.toJSON().slice(0, 10), element);
          }
        });
        let tempList = [];
        mapOfDates.forEach((element) => {
          tempList.push(element);
        });
        data = tempList;
      } else {
        const listOfDates = await calculateDates();
        data = await Data.find({ name: "node-" + parameters.node })
          .where("date")
          .in(listOfDates)
          .exec();
      }

      if (data !== null) {
        res.status(200).json({
          status: 200,
          data: data,
          message: "Data was sent!",
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Error, no data was found!",
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Not authorized!",
      });
    }
  } catch (err) {}
});

router.get("/status", async (req, res) => {
  try {
    var parameters = req.query;

    const user = await User.findOne({ username: parameters.username }).exec();
    if (
      user !== null &&
      parameters.token !== "null" &&
      bcrypt.compareSync(user.token, parameters.token)
    ) {
      let currentDate = new Date().toJSON().slice(0, 10);
      const data = await Data.find().where("date").in(currentDate).exec();
      if (data !== null) {
        res.status(200).json({
          status: 200,
          wateringStatus: await calculateStatus(data),
          message: "Data was sent!",
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Error, no data was found!",
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Not authorized!",
      });
    }
  } catch (err) {}
});
router.post("/", async (req, res) => {
  try {
    var parameters = req.query;

    if (dataPassword === parameters.password) {
      const data = await Data.findOne({
        name: parameters.name,
        date: parameters.date,
      }).exec();
      if (data !== null) {
        data.numberOfWaterings =
          parseInt(data.numberOfWaterings) +
          parseInt(parameters.numberOfWaterings);
        await data.save();
      } else {
        let newData = new Data();
        newData.name = parameters.name;
        newData.date = parameters.date;
        newData.numberOfWaterings = parameters.numberOfWaterings;
        await newData.save();
      }
      res.status(200).json({
        status: 200,
        message: "Data was recived!",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Wrong password!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: "Someting went wrong!",
    });
  }
});

async function calculateDates() {
  let listOfDates = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - i);
    listOfDates.push(newDate.toJSON().slice(0, 10));
  }
  return listOfDates;
}

async function calculateStatus(data) {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum = sum + data[i].numberOfWaterings;
  }

  if (12 < sum) {
    return " High temperature, a large number of waterings needed. ";
  } else if (6 <= sum <= 12) {
    return " Moderat temperature, avarage number of waterings needed. ";
  } else if (6 < sum) {
    return " Low temperature, few waterings needed. ";
  } else {
    return " Someting went wrong. ";
  }
}

module.exports = router;
