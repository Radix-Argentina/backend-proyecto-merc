const varietyModel = require("../models/varieties.model.js");
const productModel = require("../models/products.model.js");
const validation = require("../helpers/validations.js");
const mongoose = require("mongoose");

const createVariety = async (req, res) => {
    try {
        const { name, productId } = req.body;
        
        if(!productId) return res.status(400).json({ message: "El producto es obligatorio"});
        if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ message: "Producto inválido"});
        
        const product = await productModel.findById(productId);
        if(!product) return res.status(404).json({ message: "El producto no existe"});
        if(!product.isActive) return res.status(400).json({ message: "La variedad debe corresponder a un producto activo"});

        if(!name) return res.status(400).json({ message: "El nombre es obligatorio"});
        if(!validation.validateName(name)) return res.status(400).json({ message: "Nombre inválido"});

        const repeatedName = await varietyModel.findOne({ name, productId});
        if(repeatedName) return res.status(400).json({message: "Ya existe una variedad con ese nombre"});

        const variety = new varietyModel({
            name,
            productId
        });
        await variety.save();
        return res.status(201).json({
            variety,
            message: "La variedad fue creada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const updateVariety = async (req, res) => {
    try{
        const { name } = req.body;
        const variety = await varietyModel.findById(req.params.id);

        if(!variety) return res.status(404).json({ message: "No se encontró la variedad buscada"});

        if(!name) return res.status(400).json({ message: "El nombre es obligatorio"});
        if(!validation.validateName(name)) return res.status(400).json({ message: "Nombre inválido"});

        const repeatedName = await varietyModel.findOne({ name, productId: variety.productId});
        if(repeatedName && !repeatedName._id.equals(variety._id)) return res.status(400).json({message: "Ya existe una variedad con ese nombre"});

        variety.name = name;
        await variety.save();

        return res.status(200).json({
            name,
            message: "Variedad modificada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {createVariety, updateVariety};