const { body } = require("express-validator");
const { isValidObjectId } = require("mongoose");

module.exports = {
  ArchiveValidator: [body("feedback").isString().notEmpty(),
 
  body("services").isArray().notEmpty(),
  body("venues").isArray().notEmpty()],
  RegisterValidator: [
    body("name").isString().notEmpty(),
    body("emailId").isEmail().notEmpty(),
    body("password").isString().notEmpty(),
    body("mobileNo").isNumeric().notEmpty(),
    body("address").isString().notEmpty(),
    body("pincode").isNumeric().notEmpty(),
  ],
  loginValidator: [
    body("emailId").isEmail().notEmpty(),
    body("password").isString().notEmpty(),
  ],
  VenueValidator: [
    body("name").isString().notEmpty(),
    body("emailId").isString().notEmpty(),
    body("type").isString().notEmpty(),
    body("location").isString().notEmpty(),
    //body("package").isArray().notEmpty(),
    
    body("mobileNo").isNumeric().notEmpty(),
    
  ],
  ServiceValidator: [
    body("name").isString().notEmpty(),
    body("emailId").isString().notEmpty(),
    body("type").isString().notEmpty(),
    body("Address").isString().notEmpty(),
    
    body("subtype").isString().notEmpty(),
    body("info").isString().notEmpty(),
    body("charge").isNumeric().notEmpty(),
    //body("theme").isArray().notEmpty(),
    body("mobileNo").isNumeric().notEmpty(),
    
  ],
  ReviewValidator: [
    body("rate").notEmpty().isNumeric(),
    body("text").notEmpty().isString(),
    body("flag").notEmpty().isBoolean(),
   
    
  ],
  ProfessionalValidator:[
    body("DesignerName").isString().notEmpty(),
    body("subtype").isString().notEmpty(),
    body("type").isString().notEmpty(),
    body("location").isString().notEmpty(),
    body("services").isArray().notEmpty(),
    body("venues").isArray().notEmpty(),
    
    body("decor").isString().notEmpty(),
    body("charge").isNumeric().notEmpty(),
   
    body("theme").isArray().notEmpty(),
  ]
};