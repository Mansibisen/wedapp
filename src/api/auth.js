const auth = require('express').Router();
// Importing Models
const jwtMiddleware = require('../middlewares/jwt');

const loginRouter = require('./routers/login');
const registerRouter = require('./routers/register');


auth.use('/login', loginRouter);
auth.use('/register', registerRouter);

module.exports = auth;
