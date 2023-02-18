var express = require('express');
var request = require('request');
var User = require("../models/User");
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', async (req, res) => {

    try{
        var parameters = req.query;
    
        const user = await User.findOne({username: parameters.username, password: parameters.password}).exec();

        if(user !== null) {
        user.token = tokenGenerator();
        await user.save();

            res.status(200).json({
                status: 200,
                message: "Login Successful!",
                token: user.token
            });
        }else {

          const  user1 = await User.findOne({username: parameters.username}).exec();
          if(user1 !== null && parameters.token !== "null" && bcrypt.compareSync(user1.token, parameters.token)) {
                res.status(200).json({
                    status: 200,
                    message: "Login Successful!",
                    token: user1.token
                });

            } else {
                res.status(401).json({
                    status: 401,
                    message: "Wrong username or password!",
                });
            } 
        }
    }catch(err) {

        res.status(500).json({
            status: 500,
            message: "Something went wrong!",
        });
    }

    function tokenGenerator () {

        var characters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z"
          ,"1","2","3","4","5","6","7","8","9",
          "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","z",
          "!","#","€","%","&","/","=","?","+","*"];
  
        var token = "";
        for(var i = 0; i < 15; i ++ ) {
          
        token += characters[Math.floor(Math.random() * 69)];
          
        }
        return token;
      }
    
});

module.exports = router;
