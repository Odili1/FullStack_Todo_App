const {Schema, model} = require('mongoose');


const productsSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    task: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    user_id: {
        type: Schema.Types.Number,
        ref: "Users"
    },
    created_at: Date,
    updated_at: Date
})

const productsModel = model('Tasks', productsSchema);

module.exports = productsModel