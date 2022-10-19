const ReviewRouter = require('express').Router();

const User = require('../../database/models/user.js');
const Service = require('../../database/models/service.js');
const Venue = require('../../database/models/venues.js');
const { ReviewValidator } = require("../../middlewares/expressValidator");
const { validationResult } = require("express-validator");



ReviewRouter.post("/add", ReviewValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.jwt_payload;
    const { rate , text , pid , flag  } = req.body;
    if (  !rate || !text || !pid || !flag  )
      return res.status(400).json({ message: "Enter all fields" });
    const user = await User.findById(id);
    if(!user)
    return res.status(404).json({msg:"Not registered"})
    if(flag){
        const service = await Service.findById(pid);
        console.log(service)
        service.reviews.push({rate , text , by:user});
        let prev = service.rating;
        if(prev== null)prev =0;
        let len = service.reviews.length;
        service.rating = (prev+rate)/(len+1)
        await service.save();
    }else{
        const venue = await Venue.findById(pid);
        venue.reviews.push({rate , text , by:user});
        let prev = venue.rating;
        if(prev== null)prev =0;
        let len = venue.reviews.length;
        venue.rating = (prev+rate)/(len)


        await venue.save();
    }
    return res.status(200).json({msg:"review created successfuly"});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server Error, Try again later" });
  }
});



module.exports = ReviewRouter;

	
