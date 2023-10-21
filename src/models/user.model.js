const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');

const userSchema = new Schema({
    _id: {type: String, default: shortid.generate},
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    created_at: Date,
    updated_at: Date
}, {timestamps: true});

// Before save
userSchema.pre('save', async function(next){
    const user = this

    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash
    console.log('pre save ', user._id);
    next()
})

userSchema.methods.isValidPassword = async function(password){
    const user = this

    const compare = await bcrypt.compare(password, user.password)

    return compare
}


const userModel = model('Users', userSchema);

module.exports = userModel;