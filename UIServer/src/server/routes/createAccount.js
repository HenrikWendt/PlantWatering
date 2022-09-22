var express = require('express');
var request = require('request');
var User = require("../models/User");
var router = express.Router();

/* GET home page. */
router.post('/', async (req, res) => {

    try {

      var parameters = req.body;
      var response = {statuscode: 0000 , data: ""};
      const code = "123456789";
      let sentCode = null;

     // let user = new User(req.body);

     sentCode = parameters.params.code;

      if ( sentCode === code) {
        
        let user = new User();
        user.username = parameters.params.username;
        user.password = parameters.params.password;
        user = await user.save();
        res.status(200).json({
          status: 200,
          message: "Account Successfully created!",
        });

      } else {
        res.status(400).json({
          status: 400,
          message: "Not authorized!",
        });
      }
     
    } catch (err) {
      if(err.code === 11000) {
        res.status(400).json({
          status: 400,
          message: "Username already exists!",
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Someting went wrong!",
        });

      }
      
    }


});

module.exports = router;
