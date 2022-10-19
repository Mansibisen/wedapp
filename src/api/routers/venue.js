const VenueRouter = require('express').Router();

const User = require('../../database/models/user.js');

const Venue = require('../../database/models/venues.js');
const { VenueValidator } = require("../../middlewares/expressValidator");
const { validationResult } = require("express-validator");
const multer  = require('multer')
const { storage } = require("../../helpers/mutler")
let upload = multer({ storage });



VenueRouter.post("/add",upload.array('photos', 12), VenueValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.jwt_payload;
    const { name , location , mobileNo , type  , emailId , packages} = req.body;
    if (!emailId ||  !name || !location || !mobileNo || !type  )
      return res.status(400).json({ message: "Enter all fields" });
    const user = await User.findById(id);
    if(!user)
    return res.status(404).json({msg:"Not registered"})
    console.log(user.role)
    if(user.role != 'agent')
    return res.status(402).json({msg:"you don't have permission to add"})
    let files = [];
    let photos = req.files;
    console.log(req.files)
    if(req.files != undefined){
      for( let i =0 ;  i < photos.length ; i++){
        files.push(photos[i].filename);
      }
    }
    const venue = await Venue.create({
        Host_id : user._id,
        name : name , 
        location: location , 
        mobileNo: mobileNo , 
        type:type , 
        Photos : files,
       packages :packages , 
        emailId:emailId,

    })
    user.venuecreated.push(venue);
    await user.save();
    return res.status(200).json({msg:"venue created successfuly"});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server Error, Try again later" });
  }
});


VenueRouter.get("/list", async (req, res) => {
    try {
     
      const {  location,   type  } = req.query;
      console.log(req.query)
      const venues = await Venue.find( req.query);
      return res.status(200).json({venues : venues})

    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });

  VenueRouter.put("/update",upload.array('photos', 12), async (req, res) => {
    try {
      
      const { pid } = req.body;
      const { id } = req.jwt_payload;
      const user = await User.findById(id);
      if(!user)
      return res.status(404).json({msg:"Not registered"})
      console.log(user.role)
      if(user.role != 'agent')
      return res.status(402).json({msg:"you don't have permission to add"})
      const s = await Venue.findById(pid);
    
      if(s.Host_id != id){
        return res.status(403).json({msg:"you can update only your venue"})
      }
      let files = [];
      let photos = req.files;
      console.log(req.files)
      if(req.files != undefined){
        for( let i =0 ;  i < photos.length ; i++){
          files.push(photos[i].filename);
        }
    }
      req.body.Photos = files;
      const  venue = await Venue.findByIdAndUpdate(pid , req.body);
      return res.status(200).json({msg:"venue updated  successfuly"});
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });
  VenueRouter.delete("/delete", async (req, res) => {
    try {
      
      const { venueid } = req.body;
      const { id } = req.jwt_payload;
      const user = await User.findById(id);
      if(!user)
      return res.status(404).json({msg:"Not registered"})
      console.log(user.role)
      if(user.role != 'agent')
      return res.status(402).json({msg:"you don't have permission to delete"})
      const  venue = await VenueRouter.findByIdAndRemove(venueid);
      let index = user.venuecreated.indexOf(venueid);
      if (index !== -1) {
        user.venuecreated.splice(index, 1);
      }
      await user.save();
      return res.status(200).json({msg:"venue deleted  successfuly"});
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });

  VenueRouter.post("/book", async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {   Id  , packageId , bookingDate  } = req.body;
      const { id } = req.jwt_payload;
      console.log(req.body)
      if (!Id ||!packageId || !bookingDate)
        return res.status(400).json({ message: "Enter all fields" });
      const user = await User.findById(id);
      if(!user)
      return res.status(404).json({msg:"Not registered"})

      
  
      const venue = await Venue.findById(Id)
      if(venue.avaliabilty.includes({
        packageType:packageId,
        date: bookingDate,
        
      })){
        return res.status(402).json({msg:"the service is already booked for given date"})
      }
      venue.avaliabilty.push({
        packageType:packageId,
        date: bookingDate,
        
      })
      await venue.save()
      user.venueused.push(venue);
      await user.save();
      return res.status(200).json({msg:"venue booked successfuly"});
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });
module.exports = VenueRouter;

	
