const ProfessionalRouter = require('express').Router();

const User = require('../../database/models/user.js');
const Service = require('../../database/models/service.js');
const Venue = require('../../database/models/venues.js');
const Professional = require('../../database/models/professional.js');
const { ProfessionalValidator } = require("../../middlewares/expressValidator");
const { validationResult } = require("express-validator");
const multer  = require('multer')
const { storage, fileFilter } = require("../../helpers/mutler")
let upload = multer({ storage, fileFilter });


	


ProfessionalRouter.post("/add",upload.array('photos', 12),ProfessionalValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.jwt_payload;
    const {   type , subtype , location , charge , DesignerName , decor , theme , services , venues } = req.body;
    console.log(req.body)
    
    const user = await User.findById(id);
    if(!user)
    return res.status(404).json({msg:"Not registered"})
    if(user.role != 'professional')
    return res.status(402).json({msg:"you don't have permission to add"})
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
   
    const profs = await Professional.create({
        subtype,
        type,
        charge,
        location,
        decor , 
        theme,
        DesignerName,
        services:servicesArray,
        venues:venuesArray,
        Photos : files


  })
    return res.status(200).json({msg:"professional item  created successfuly"});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server Error, Try again later" });
  }
});


ProfessionalRouter.get("/list", async (req, res) => {
    try {
     
      
      console.log(req.query)
      const profs = await Professional.find( req.query).populate();
      return res.status(200).json({Professional : profs})

    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });

module.exports = ProfessionalRouter;

	
 