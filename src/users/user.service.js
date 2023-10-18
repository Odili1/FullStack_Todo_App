const UserModel = require('../models/users.model');
const jwt = require('jsonwebtoken')

require('dotenv').config()


const CreateUser = async (req, res) => {
    try {
        const userFromRequest = req.body

        // const existingUser = await UserModel.findOne({
        //     email: userFromRequest.email
        // });

        // if (existingUser) {
        //     return res.status(409).json({
        //         message: 'User already exist',
        //     })
        // }

        const user = await UserModel.create({
            name: userFromRequest.name,
            password: userFromRequest.password,
            email: userFromRequest.email,
            contact: userFromRequest.contact,
            phone_number: userFromRequest.phone_number,
            gender: userFromRequest.gender
        });

        const token = jwt.sign({email: user.email, _id: user.id}, process.env.JWT_SECRET)


    return res.status(201).json({
        message: 'User created successfully',
        user,
        token
    })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "User creation failed"
        })
    }
}


const Login = async (req, res) => {
    try {
        const userFromRequest = req.body

        const user = await UserModel.findOne({
            email: userFromRequest.email,
        });
    
        if (!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
    
        const validPassword = await user.isValidPassword(userFromRequest.password)
    
        console.log(validPassword);
        if (!validPassword) {
            return res.status(422).json({
                message: 'Email or password is not correct',
            }) 
        }
    
        const token = jwt.sign({email: user.email, _id: user.id}, process.env.JWT_SECRET)
        return res.status(201).json({
            message: 'Login successful',
            user,
            token
        })
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

}


module.exports = {
    CreateUser,
    Login
}