var express = require('express');
var request = require('request');
var User = require("../models/User");
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {

    try{
        var parameters = req.query;
    
        const user = await User.findOne({username: parameters.username, password: parameters.password}).exec();
        if(user !== null) {
            res.status(200).json({
                status: 200,
                message: "Login Successful!",
            });
        }else {
            res.status(400).json({
                status: 400,
                message: "Wrong username or password!",
            });
        }
    }catch(err) {

    }
    
});

module.exports = router;
