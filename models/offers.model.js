const mongoose = require("mongoose");

const {Schema} = mongoose;

const offersSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    wasBought: {
        type: Boolean,
        default: false,
    },
    supplierId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "suppliers"
    },
    varietyId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "varieties"
    }
},{versionKey: false, timestamps: true});

const offersModel = mongoose.model('offers', offersSchema);

module.exports = offersModel;