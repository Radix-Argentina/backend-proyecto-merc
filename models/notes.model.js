const mongoose = require("mongoose");

const {Schema} = mongoose;

const notesSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 100,
        required: true,
    },
    text: {
        type: String,
        trim: true,
        minLength: 0,
        maxLength: 256,
        default: "",
    },
    writerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "users"
    } 
},{versionKey: false, timestamps: true});

const notesModel = mongoose.model('notes', notesSchema);

module.exports = notesModel;