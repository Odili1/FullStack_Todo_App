const {Schema, model} = require('mongoose');
const shortid = require('shortid');


const tasksSchema = new Schema({
    _id: {type: String, default: shortid.generate},
    task: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    },
    user_id: {
        type: String,
        ref: "Users"
    },
    created_at: Date,
    updated_at: Date
})

const productsModel = model('Tasks', tasksSchema);

module.exports = productsModel