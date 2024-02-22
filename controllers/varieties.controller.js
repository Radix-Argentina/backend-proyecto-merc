const varietyModel = require("../models/varieties.model.js");
const productModel = require("../models/products.model.js");
const offerModel = require("../models/offers.model.js");
const validation = require("../helpers/validations.js");
const mongoose = require("mongoose");

const createVariety = async (req, res) => { //ACID
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

const updateVariety = async (req, res) => { //ACID
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

const deleteVariety = async (req, res) => { //ACID
    //Al borrar debe estar inactivo, y no puede borrarse si tiene offers creadas
    const session = await mongoose.startSession(); // Inicia una sesión de transacción
    session.startTransaction(); // Inicia la transacción
    try {
        const variety = await varietyModel.findById(req.params.id).session(session);
        if(!variety){
            await session.abortTransaction(); // Rollback
            session.endSession(); // Finaliza la sesión de transacción
            return res.status(404).json({message: "La variedad que desea eliminar no existe"});
        }
        if(variety.isActive){
            await session.abortTransaction(); // Rollback
            session.endSession(); // Finaliza la sesión de transacción
            return res.status(400).json({message: "Solo puede eliminar variedades inactivas"});
        }
        
        await offerModel.deleteMany({varietyId: variety._id}).session(session);

        await varietyModel.findByIdAndDelete(req.params.id).session(session);

        await session.commitTransaction(); // Confirma la transacción
        session.endSession(); // Finaliza la sesión de transacción
        return res.status(200).json({
            variety,
            message: "La variedad y sus ofertas fueron eliminadas con éxito",
        });
    }
    catch (error) {
        await session.abortTransaction(); // Rollback en caso de error
        session.endSession(); // Finaliza la sesión de transacción
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deactivate = async (req, res) => { //ACID
    //Desactivar una variedad implica desactivar sus offers
    const session = await mongoose.startSession(); // Inicia una sesión de transacción
    session.startTransaction(); // Inicia la transacción
    try{
        const variety = await varietyModel.findById(req.params.id).session(session);
        if(!variety){
            await session.abortTransaction(); // Rollback
            session.endSession(); // Finaliza la sesión de transacción
            return res.status(404).json({ message: "La variedad no existe"});
        }
        
        const offers = await offerModel.find({varietyId: variety._id}).session(session); //Probar si desactiva todas las offers
        for(let i = 0; i < offers.length; i++){

            offers[i].isActive = false;
            await offers[i].save({session});

        }
        variety.isActive = false;
        
        await variety.save({session});
        await session.commitTransaction(); // Confirma la transacción
        session.endSession(); // Finaliza la sesión de transacción
        return res.status(200).json({message: `La variedad ${variety.name} fue desactivada`});
    }
    catch(error){
        await session.abortTransaction(); // Rollback en caso de error
        session.endSession(); // Finaliza la sesión de transacción
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const activate = async (req, res) => { //ACID
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

const getVarietyById = async (req, res) => { //ACID
    try{
        const variety = await varietyModel.findById(req.params.id).populate({
            path: "productId",
            select: ["_id", "name", "isActive"]
        });
        if(!variety) return res.status(404).json({ message: "La variedad no existe"});
        
        const offers = await offerModel.find({varietyId: variety._id}).populate({
            path: "supplierId",
            select: ["name","isActive","_id"]
        });

        let response = {
            ...variety._doc,
            product: variety.productId,
            offers: []
        }

        delete response.productId;

        for(let offer of offers) {
            const responseOffer = {
                ...offer._doc,
                supplier: offer.supplierId,
            }

            delete responseOffer.varietyId;
            delete responseOffer.supplierId;

            response.offers.push(responseOffer);
        }

        return res.status(200).json({
            variety: response,
            message: "Variedad encontrada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAllVarieties = async (req, res) => { //ACID
    try{
        const { isActive } = req.query;

        let filter = {};

        if(isActive) filter.isActive = undefined;
        if(isActive?.toLowerCase() === "true") filter.isActive = true;
        if(isActive?.toLowerCase() === "false") filter.isActive = false;
        if(isActive?.toLowerCase() === "all") delete filter.isActive;

        const varieties = await varietyModel.find(filter).populate({
            path: "productId",
            select: ["name", "isActive"],
        });

        return res.status(200).json({ //Si esta funcion lo requiere se deverian hacer los populate de cada variety con las offers, sino dejar asi
            varieties,
            message: "Variedades encontradas con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {createVariety, updateVariety, deleteVariety, deactivate, activate, getVarietyById, getAllVarieties};