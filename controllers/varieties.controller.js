const varietyModel = require("../models/varieties.model.js");
const productModel = require("../models/products.model.js");
const offerModel = require("../models/offers.model.js");
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

const deleteVariety = async (req, res) => { //Al borrar debe estar inactivo, y no puede borrarse si tiene offers creadas
    try {
        const variety = await varietyModel.findById(req.params.id);
        if(!variety) return res.status(404).json({message: "La variedad que desea eliminar no existe"});
        if(variety.isActive) return res.status(400).json({message: "Solo puede eliminar variedades inactivas"});
        
        const offers = await offerModel.find({varietyId: variety._id});
        
        if(offers.length > 0) return res.status(400).json({message: "No se puede eliminar una variedad con ofertas creadas"});

        await varietyModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            variety,
            message: "La variedad fue eliminada con éxito",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deactivate = async (req, res) => { //Desactivar una variedad implica desactivar sus offers
    try{
        const variety = await varietyModel.findById(req.params.id);
        if(!variety) return res.status(404).json({ message: "La variedad no existe"});
        
        const offers = await offerModel.find({varietyId: variety._id}); //Probar si desactiva todas las offers
        for(let i = 0; i < offers.length; i++){

            offers[i].isActive = false;
            await offers[i].save();

        }
        variety.isActive = false;
        
        await variety.save();
        return res.status(200).json({message: `La variedad ${variety.name} fue desactivada`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const activate = async (req, res) => {
    try{
        const variety = await varietyModel.findById(req.params.id);
        if(!variety) return res.status(404).json({ message: "La variedad no existe"});
        variety.isActive = true;
        await variety.save();
        return res.status(200).json({message: `La variedad ${variety.name} fue activada`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {createVariety, updateVariety, deleteVariety, deactivate, activate};