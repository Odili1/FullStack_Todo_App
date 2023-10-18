const {Schema, model} = require('mongoose');


const productsSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
        unique: true
    },
    state: {
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