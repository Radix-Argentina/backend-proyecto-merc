const offerModel = require("../models/offers.model.js");
const validation = require("../helpers/validations.js");
const supplierModel = require("../models/suppliers.model.js");
const productModel = require("../models/products.model.js");
const varietyModel = require("../models/varieties.model.js");
const mongoose = require("mongoose");

const createOffer = async (req, res) => {
    try {
        const { date, price, supplierId, varietyId } = req.body;
        if(!date) return res.status(400).json({ message: "La fecha es obligatoria"});
        if(!price) return res.status(400).json({ message: "El precio es obligatorio"});
        if(!supplierId) return res.status(400).json({ message: "El proveedor es obligatorio"});
        if(!varietyId) return res.status(400).json({ message: "La variedad es obligatoria"});
        
        if(!validation.validateDate(date)) return res.status(400).json({ message: "Fecha inválida"});
        if(!validation.validatePrice(price)) return res.status(400).json({ message: "Precio inválido"});
        if(!mongoose.Types.ObjectId.isValid(supplierId)) return res.status(400).json({ message: "Proveedor inválido"});
        if(!mongoose.Types.ObjectId.isValid(varietyId)) return res.status(400).json({ message: "Variedad inválida"});

        const supplier = await supplierModel.findById(supplierId);
        const variety = await varietyModel.findById(varietyId);
        if(!supplier) return res.status(400).json({message: "El proveedor no existe"});
        if(!variety) return res.status(400).json({message: "La variedad no existe"});

        const offer = new offerModel({
            date,
            price,
            supplierId,
            varietyId
        });
        await offer.save();
        return res.status(201).json({
            offer,
            message: "La oferta fue creada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const updateOffer = async (req, res) => {
    try{
        const { date, price, supplierId, varietyId } = req.body;
        const offer = await offerModel.findById(req.params.id);

        if(!offer) return res.status(404).json({ message: "No se encontró la oferta buscada"});

        if(date) offer.date = date;
        if(price) offer.price = price;
        
        if(date && !validation.validateDate(offer.date)) return res.status(400).json({ message: "Fecha inválida"});
        if(price && !validation.validatePrice(offer.price)) return res.status(400).json({ message: "Precio inválido"});
        if(supplierId && !mongoose.Types.ObjectId.isValid(supplierId)) return res.status(400).json({ message: "Proveedor inválido"});
        if(varietyId && !mongoose.Types.ObjectId.isValid(varietyId)) return res.status(400).json({ message: "Variedad inválida"});

        if(supplierId && mongoose.Types.ObjectId.isValid(supplierId)){
            const supplier = await supplierModel.findById(supplierId);
            if(!supplier) return res.status(400).json({message: "El proveedor no existe"});
        }
        if(varietyId && mongoose.Types.ObjectId.isValid(varietyId)){
            const variety = await varietyModel.findById(varietyId);
            if(!variety) return res.status(400).json({message: "La variedad no existe"});
        }

        if(supplierId) offer.supplierId = supplierId;
        if(varietyId) offer.varietyId = varietyId;

        await offer.save();

        return res.status(200).json({
            offer,
            message: "Oferta modificada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deleteOffer = async (req, res) => { //Al borrar debe estar inactiva
    try {
        const offer = await offerModel.findById(req.params.id);
        if(!offer) return res.status(404).json({message: "La oferta que desea eliminar no existe"});
        
        if(offer.isActive) return res.status(400).json({message: "Solo puede eliminar ofertas inactivas"});

        await offerModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            offer,
            message: "La oferta fue eliminada con éxito",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deactivate = async (req, res) => {
    try{
        const offer = await offerModel.findById(req.params.id);
        if(!offer) return res.status(404).json({ message: "La oferta no existe"});

        offer.isActive = false;
        
        await offer.save();
        return res.status(200).json({message: `La oferta fue desactivada`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const activate = async (req, res) => {
    try{
        const offer = await offerModel.findById(req.params.id);
        if(!offer) return res.status(404).json({ message: "La oferta no existe"});
        offer.isActive = true;
        await offer.save();
        return res.status(200).json({message: `La oferta fue activada`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getOfferById = async (req, res) => {
    try{
        const offer = await offerModel.findById(req.params.id).populate({
            path: "supplierId",
            select: ["name","isActive"] //Podría devolver mas informacion pero por ahora lo dejo asi
        }).populate({
            path: "varietyId",
            select: ["name","_id","productId", "isActive"],
        });
        if(!offer) return res.status(404).json({message: "La oferta buscada no existe"});
        
        const product = await productModel.findById(offer.varietyId.productId);
        
        const response = {
            product: {
                name: product.name,
                isActive: product.isActive,
                variety: {
                    name: offer.varietyId.name,
                    isActive: offer.varietyId.isActive
                }
            },
            supplier: {
                name: offer.supplierId.name,
                isActive: offer.supplierId.isActive
            },
            date: offer.date,
            price: offer.price,
            isActive: offer.isActive

        }
        return res.status(200).json({
            offer: response,
            message: "Oferta encontrada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const getAllProducts = async (req, res) => {
    try{
        const { isActive } = req.query;

        let filter = {};

        if(isActive) filter.isActive = undefined;
        if(isActive?.toLowerCase() === "true") filter.isActive = true;
        if(isActive?.toLowerCase() === "false") filter.isActive = false;
        if(isActive?.toLowerCase() === "all") delete filter.isActive;

        const products = await productModel.find(filter);
        
        return res.status(200).json({ //Si esta funcion lo requiere se deveria n hacer los populate de cada product con las varieties, sino dejar asi
            products,
            message: "Productos encontrados con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {getOfferById, createOffer, updateOffer, deleteOffer, activate, deactivate};