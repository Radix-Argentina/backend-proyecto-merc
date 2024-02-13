const mongoose = require("mongoose");

const {Schema} = mongoose;

const suppliersSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 3,
        maxLength: 25,
    },
    mail: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 100,
    },
    phone: {
        type: String, //Lo guardamos como string para incluir signos que puedan estar en el numero de telefono
        trim: true,
        minLenght: 7,
        maxLenght: 16,
    },
    address: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    contact: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
},{versionKey: false});

const suppliersModel = mongoose.model('suppliers', suppliersSchema);

module.exports = suppliersModel;