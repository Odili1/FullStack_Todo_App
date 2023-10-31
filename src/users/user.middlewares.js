const joi = require('joi');

exports.validateSignup = async (req, res, next) => {
    try {
        const Schema = joi.object({
            username: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required(),
        });

        await Schema.validateAsync(req.body, {abortEarly: true})

        console.log('valid');
        next()
    } catch (error) {

        res.render('signup', {user: null, message: error.message})
    }
}


exports.validateLogin = async(req, res, next) => {
    try {
        const Schema = joi.object({
            username: joi.string().required(),
            password: joi.string().required(),
        })

        await Schema.validateAsync(req.body, {abortEarly: true})

        next()
    } catch (error) {

        res.render('login', {user: null, message: error.message})
    }
}