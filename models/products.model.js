const mongoose = require("mongoose");

const {Schema} = mongoose;

const productsSchema = new Schema({
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
    }
},{versionKey: false});

const productsModel = mongoose.model('products', productsSchema);

module.exports = productsModel;