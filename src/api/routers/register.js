const registerRouter = require('express').Router();

const User = require('../../database/models/user.js');

const { createJWTtoken } = require('../../middlewares/jwt');

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  RegisterValidator,
} = require("../../middlewares/expressValidator");





registerRouter.post("/", RegisterValidator, async (req, res) => {
    try {
      const { name, emailId, mobileNo, password , address , pincode , role} = req.body;
      console.log(req.body)
      const pwd = await bcrypt.hash(
        password,
        parseInt(10, 'wedapp')
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const uniquePhone = await User.findOne({ mobileNo });
      const uniqueEmail = await User.findOne({ emailId });
      if (uniquePhone !== null || uniqueEmail !== null) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await User.create({
        emailId,
        mobileNo,
        name,
        password: pwd,
        pincode:pincode,
        address:address,
        role,
      });
      const token = await createJWTtoken(user);
      const date = new Date();
      date.setTime(date.getTime() + 86400000);
      return res.status(200).json({ user, token, expiration: date });
      
      
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });

module.exports = registerRouter;
