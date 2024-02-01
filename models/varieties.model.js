const mongoose = require("mongoose");

const {Schema} = mongoose;

const varietiesSchema = new Schema({ //Necesitamos que el par [name, productId] sea único, ya se lo controla por js pero habria que ver si se puede hacer desde el schema tambien
    name: {
        type: String,
        required: true,
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
    //Tal vez quieran agregar un campo que sea precio estimado, como para comparar con las ofertas
},{versionKey: false});

const varietiesModel = mongoose.model('varieties', varietiesSchema);

module.exports = varietiesModel;