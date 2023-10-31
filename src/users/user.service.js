const UserModel = require('./../models/user.model');
const jwt = require('jsonwebtoken')

require('dotenv').config()


const CreateUser = async ({username, email, password}) => {
    console.log('signup service');
    try {
        const existingUser = await UserModel.findOne({
            email: email
        });

        if (existingUser) {
            return {
                code: 403,
                message: "User already exists",
                success: false
            }
        }

        const user = await UserModel.create({
            username: username,
            email: email,
            password: password,
        });
        
        const token = jwt.sign({username: user.username, email: user.email, _id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

        console.log('signup', {user, token});

    return {
        code: 201,
        message: "User created succefully",
        success: true,
        token,
        user
    }
    } catch (error) {
        return {
            code: 400,
            message: "Something went wrong. Please go back to home page",
            success: false
        }
    }
}


const Login = async ({username, password}) => {
    console.log('login service');
    try {
        const user = await UserModel.findOne({
            username: username,
        });
        
        if (!user){
            return {
                code: 404,
                message:"Invalid Username or Password"
            }
        }
        
        const validPassword = await user.isValidPassword(password)
    
        if (!validPassword) {
            return {
                code: 422,
                message: "Incorrect Email or Password"
            }
        }
    
        const token = jwt.sign({username: username, email: user.email, _id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        return {
            code: 200,
            message: 'Login successful',
            user,
            token
        }
    } catch (error) {
        return {
            code: 401,
            message: "Unauthorized"
        }
    }

}


module.exports = {
    CreateUser,
    Login
}