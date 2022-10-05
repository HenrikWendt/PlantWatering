var express = require('express');
var request = require('request');
var User = require("../models/User");
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', async (req, res) => {
    try{
        var parameters = req.query;
        console.log(parameters)
        const user = await User.findOne({username: parameters.username}).exec();
        if(user !== null && parameters.token !== "null" && bcrypt.compareSync(user.token, parameters.token)) {

            console.log("Preparing watering!")

            let data = {
                password: "something",
                amount: 1,
            }
            var requestWatering = {
                uri: 'https://99fd5ed6-ae9d-4e8b-8775-02d4bc0ee493.mock.pstmn.io/waterPlants',
                body: JSON.stringify(data),
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            request(requestWatering, function (error, response) {
                
                if(response.statusCode === 200) {
                    res.status(200).json({
                        message: "Watering started!",
                    });
                }else {
                    res.status(400).json({
                        message: "Something went wrong, no watering performed!",
                    });
                }
            });
        }else {
            res.status(400).json({
                status: 400,
                message: "Not authorized!",
            });
        }
    }catch(err) {

        console.log("error   " + err);

    }
});

module.exports = router;
