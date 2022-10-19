const api = require('express').Router();

const jwtMiddleware = require('../middlewares/jwt');

const VenueRouter = require('./routers/venue');
const ServiceRouter = require('./routers/service');
const ReviewRouter = require('./routers/review')
const ArchiveRouter = require('./routers/archive')
const ProfessionalRouter = require('./routers/professional')
api.use('/', jwtMiddleware.jwtVerify);
api.use('/venue', VenueRouter);
api.use('/service', ServiceRouter);
 api.use('/review', ReviewRouter);
api.use('/archive', ArchiveRouter);
api.use('/professional', ProfessionalRouter);
// api.get('/status', (req, res) => {
// 	return res.status(200).json({ Success: true });
// });

module.exports = api;
