const ServiceRouter = require('express').Router();

const User = require('../../database/models/user.js');
const multer  = require('multer')
const Service = require('../../database/models/service.js');
const { ServiceValidator } = require("../../middlewares/expressValidator");
const { validationResult } = require("express-validator");
const { storage, fileFilter } = require("../../helpers/mutler")
let upload = multer({ storage, fileFilter });

ServiceRouter.post("/add",upload.array('photos', 12) ,ServiceValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.jwt_payload;
    const { name , Address , mobileNo , type  ,info , charge, subtype,theme ,  emailId , packages} = req.body;
   
    if (!emailId ||  !name || !Address || !mobileNo || !type || !subtype || !charge || !info   )
      return res.status(400).json({ message: "Enter all fields" });
    const user = await User.findById(id);
    if(!user)
    return res.status(404).json({msg:"Not registered"})
    
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
    const service = await Service.create({
        Host_id : user._id,
        name , 
        Address , 
        mobileNo , 
        type , 
        subtype,
        info,
        charge,
        theme,
        Photos:files,
        
       packages :packages , 
        emailId,

    })
    
    user.servicecreated.push(service);
    await user.save();
    return res.status(200).json({msg:"service created successfuly"});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server Error, Try again later" });
  }
});




ServiceRouter.get("/list", async (req, res) => {
    try {
     
      
      console.log(req.query)
      const services = await Service.find( req.query);
      return res.status(200).json({services : services})

    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });



  ServiceRouter.put("/update", upload.array('photos', 12) , async (req, res) => {
    try {
      
      const { pid } = req.body;
      const { id } = req.jwt_payload;
      const user = await User.findById( id);
      if(!user)
      return res.status(404).json({msg:"Not registered"})
      console.log(user.role)
      if(user.role != 'agent')
      return res.status(402).json({msg:"you don't have permission to update"})
      const s = await Service.findById(pid);
      console.log(s)
      console.log(id)
      if(s.Host_id != id){
        return res.status(403).json({msg:"you can update only your service"})
      }
      let files = [];
      let photos = req.files;
      console.log(req.files)
      for( let i =0 ;  i < photos.length ; i++){
        files.push(photos[i].filename);
      }
      req.body.Photos = files
      const  service = await Service.findByIdAndUpdate(pid , req.body);
      
      return res.status(200).json({msg:"service updated  successfuly"});
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });

  
  ServiceRouter.delete("/delete", async (req, res) => {
    try {
      const { id } = req.jwt_payload;
      const { serviceid } = req.body;
      console.log(serviceid)
      const user = await User.findById(id);
      if(!user)
      return res.status(404).json({msg:"Not registered"})
      
      if(user.role != 'agent')
      return res.status(402).json({msg:"you don't have permission to delete"})
      const  service = await Service.findByIdAndRemove(serviceid);
      let index = user.servicecreated.indexOf(serviceid);
      if (index !== -1) {
        user.servicecreated.splice(index, 1);
      }
      await user.save();
      return res.status(200).json({msg:"service deleted  successfuly"});
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });
  ServiceRouter.post("/book", async (req, res) => {
    try {
      const { id } = req.jwt_payload;
      const {   Id   , packageId , bookingDate} = req.body;
      console.log(req.body)
      if (!Id  ||!packageId || !bookingDate )
        return res.status(400).json({ message: "Enter all fields" });
      const user = await User.findById(id);
      if(!user)
      return res.status(404).json({msg:"Not registered"})

      
  
      const service = await Service.findById(Id)
      if(service.avaliabilty.includes({
        packageType:packageId,
        date: bookingDate,
        
      })){
        return res.status(402).json({msg:"the service is already booked for given date"})
      }
      service.avaliabilty.push({
        packageType:packageId,
        date: bookingDate,
        
      })
      await service.save()
      user.serviceused.push(service);
      await user.save();
      return res.status(200).json({msg:"service booked successfuly"});
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Server Error, Try again later" });
    }
  });
module.exports = ServiceRouter;

	
