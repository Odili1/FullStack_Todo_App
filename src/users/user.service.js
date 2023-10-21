const UserModel = require('./../models/user.model');
const jwt = require('jsonwebtoken')

require('dotenv').config()


const CreateUser = async ({username, email, password}) => {
    try {
        const existingUser = await UserModel.findOne({
            email: email
        });

        if (existingUser) {
            return {
                code: 409,
                message: "User already exists",
                success: false
            }
        }
        console.log('no existing' , existingUser);

        const user = await UserModel.create({
            username: username,
            email: email,
            password: password,
        });
        
        console.log('created:', user._id);
        const token = jwt.sign({username: user.username, email: user.email, _id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

        console.log('created:', token);

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
        
        console.log(user);
        if (!user){
            return {
                code: 404,
                message:"Invalid Username or Password"
            }
        }
        
        const validPassword = await user.isValidPassword(password)
        console.log(validPassword)
    
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