const mongoose = require("mongoose");

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
    supplierId: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "suppliers"
    },
    varietyId: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "varieties"
    }
},{versionKey: false, timestamps: true});

const offersModel = mongoose.model('offers', offersSchema);

module.exports = offersModel;