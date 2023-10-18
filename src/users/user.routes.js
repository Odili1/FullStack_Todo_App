const router = require('express').Router();
const controller = require('./user.service')
const middleware = require('./user.middlewares');


router.post('/signUp', middleware.validateSignup, controller.CreateUser);

router.post('/login', middleware.validateLogin, controller.Login);


module.exports = router;