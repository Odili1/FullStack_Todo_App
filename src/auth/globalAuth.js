const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

require('dotenv').config()

exports.bearerTokenAuth = (req, res, next) => {
    try {
        authHeader = req.headers;

        if (!authHeader){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const token = authHeader.authorization.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        console.log(decoded);

        if (!decoded){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const user = UserModel.findOne({email: decoded.email});

        if (!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        req.user = user;

        next()

    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}



exports.cookieAuth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
    
        if (!token) {
            res.render('home', {user: null, status: 401, message: 'Login to view your dashboard'})
        }
        
        const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log('cookie auth');
        
        if (!decodedUser) {
            res.render('home', {user: null, status: 401, message: 'Login to view your dashboard'})
        }
        
        // correct cookie
        res.locals.user = decodedUser
        
        next()
    } catch (error) {
        console.log(error);
        res.render('home', {user: null, status: 401, message: 'Login or Signup to access your dashboard'})
    }
}