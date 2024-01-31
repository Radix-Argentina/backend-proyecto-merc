const mongoose = require("mongoose");

const {Schema} = mongoose;

const varietiesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 25,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "products"
    }
},{versionKey: false});

const varietiesModel = mongoose.model('varieties', varietiesSchema);

module.exports = varietiesModel;