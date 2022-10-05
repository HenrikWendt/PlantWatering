var express = require('express');
var request = require('request');
var User = require("../models/User");
var Data = require("../models/Data");
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET home page. */

const dataPassword = "1uy23g124kjbacAWD/&Da2he12!?"
router.get('/chart', async (req, res) => {

    try{

        var parameters = req.query;
    
        const user = await User.findOne({username: parameters.username}).exec();
        console.log(user);
        if(user !== null && parameters.token !== "null" && bcrypt.compareSync(user.token, parameters.token)) {

            const data = await Data.findOne({name: "wateringData"}).exec();
            if(data !== null){

            res.status(200).json({
                status: 200,
                numberOfWaterings: data.numberOfWaterings,
                message: "Data was sent!",
            });
        }else {
            res.status(400).json({
                status: 400,
                message: "Error, no data was found!",
            });
        }
        
        }else {
            res.status(400).json({
                status: 400,
                message: "Not authorized!",
            });
        }
    }catch(err) {
       
    }
    
});

router.get('/status', async (req, res) => {

    try{
        var parameters = req.query;

        const user = await User.findOne({username: parameters.username}).exec();
        if(user !== null && parameters.token !== "null" && bcrypt.compareSync(user.token, parameters.token)) {

            const data = await Data.findOne({name: "wateringData"}).exec();
            if(data !== null){

                res.status(200).json({
                    status: 200,
                    wateringStatus: await calculateStatus(data.numberOfWaterings),
                    message: "Data was sent!",
                });
            }else {
                res.status(400).json({
                    status: 400,
                    message: "Error, no data was found!",
                });
            }
        
        }else {
            res.status(400).json({
                status: 400,
                message: "Not authorized!",
            });
        }
    }catch(err) {
       
    }

});
router.post('/', async (req, res) => {

   try{
        var parameters = req.query;
       
        if(dataPassword === parameters.password) {
            const data = await Data.findOne({name: "wateringData"}).exec();
            
            if(data !== null){
                data.numberOfWaterings = await fixData(parameters.numberOfWaterings);
                await data.save();
            }else {
                let newData = new Data();
                newData.name = "wateringData";
                newData.numberOfWaterings =  await fixData(parameters.numberOfWaterings);
                newData = await newData.save();
            }
            res.status(200).json({
                status: 200,
                message: "Data was recived!",
            });
    
        }else{
            res.status(400).json({
                status: 400,
                message: "Wrong password!",
            });
        }
    }catch(err) {
        res.status(400).json({
            status: 400,
            message: "Someting went wrong!",
        });
    }
});

async function fixData (data) {
    let tempArray = data.split('*');
    let newArray = [];
    for(var i = 0; i < tempArray.length; i++) {
        newArray.push(JSON.parse(tempArray[i]));
    }
    return newArray;
}


async function calculateStatus (data) {
    let sum = 0;

   for(var i = 0; i < data.length; i++) {
        sum = sum + data[i].number;
    }

    if(12 < sum){
        return " High temperature, a large number of waterings needed. "
    }else if(6 <= sum <= 12) {
        return " Moderat temperature, avarage number of waterings needed. "
    }else if (6 < sum) {
        return " Low temperature, few waterings needed. "
    }else {
        return " Someting went wrong. "
    }
}

module.exports = router;