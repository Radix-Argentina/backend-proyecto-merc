const mongoose = require('mongoose');

const {Schema} = mongoose;

const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "reader", "editor"],
        default: "reader",
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100,
    }
}, {versionKey: false, timestamps: true});

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;