var express = require('express');
var request = require('request');
var User = require("../models/User");
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET home page. */
router.delete('/', async (req, res) => {

    
    try{

        var parameters = req.query;
    
        const user = await User.findOne({username: parameters.username}).exec();
        if(user !== null && parameters.token !== "null" && bcrypt.compareSync(user.token, parameters.token)) {
            user.token = "null";
            await user.save();
            
            res.status(200).json({
                status: 200,
                message: "You are signed out!",
            });
        }else {

            console.log("null");

            res.status(500).json({
                status: 500,
                message: "Something went wrong!",
            });
        }
    }catch(err) {
        console.log("erroor");
    }
    
});

module.exports = router;