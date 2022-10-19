const ArchiveRouter = require('express').Router();

const User = require('../../database/models/user.js');
const Service = require('../../database/models/service.js');
const Venue = require('../../database/models/venues.js');
const Archive = require('../../database/models/archive.js');
const { ArchiveValidator } = require("../../middlewares/expressValidator");
const { validationResult } = require("express-validator");

const multer  = require('multer')
const { storage } = require("../../helpers/mutler")
let upload = multer({ storage });


ArchiveRouter.post("/add",upload.array('photos', 12) , ArchiveValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.jwt_payload;
    const {   feedback  , services , venues} = req.body;
    console.log(req.body)
    if (!feedback ||  !id || !services || !venues  )
      return res.status(400).json({ message: "Enter all fields" });
    const user = await User.findById(id);
    if(!user)
    return res.status(404).json({msg:"Not registered"})
    const servicesArray =[]
    const venuesArray =[]
    console.log(services.length)
    for (let i = 0; i < services.length; i++) {
            console.log(services[i])
            const s = await Service.findById(services[i]);
            //console.log(s)
            if(s != null){
                servicesArray.push(s)
            
            }
        
    }
    for (let i = 0; i < venues.length; i++) {
        const v = await Venue.findById(venues[i]);
        if(v != null){
            venuesArray.push(v)
        }
    }
    let files = [];
    let photos = req.files;
    console.log(req.files)
    if(req.files != undefined){
     
      for( let i =0 ;  i < photos.length ; i++){
        files.push(photos[i].filename);
    }
    }
    
    const archive = await Archive.create({
        clientName:user,
        feedback,
        services:servicesArray,
        venues:venuesArray,
        Photos : files


  })
    return res.status(200).json({msg:"Archive  created successfuly"});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server Error, Try again later" });
  }
});


ArchiveRouter.get("/list", async (req, res) => {
    try {
     
      
      console.log(req.query)
      const archive = await Archive.find( req.query).populate();
      return res.status(200).json({Archive : archive})

    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });

module.exports = ArchiveRouter;

	
 