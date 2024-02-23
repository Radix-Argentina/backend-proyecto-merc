const productModel = require("../models/products.model.js");
const varietyModel = require("../models/varieties.model.js");
const offerModel = require("../models/offers.model.js");
const validation = require("../helpers/validations.js");
const mongoose = require("mongoose");

//Crear un nuevo producto
const createProduct = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let { name, varietyName } = req.body;
        if(!name){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "El nombre es obligatorio"});
        }
        if(!validation.validateName(name)){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Nombre inválido"});
        }
        
        const repeatedName = await productModel.findOne({ name }).session(session);
        if(repeatedName){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: "Ya existe un producto con ese nombre"});
        }
        
        if(!varietyName) varietyName = "Común";
        if(!validation.validateName(varietyName)){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Nombre de variedad inválido"});
        }
        

        const product = new productModel({
            name
        });
        await product.save({session});


        const defaultVariety = new varietyModel({
            name: varietyName,
            productId: product._id
        });

        await defaultVariety.save({session});

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            product,
            message: `El producto fue creado con éxito, se creo la variedad ${varietyName} también`
        });
    }
    catch(error){

        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: error.message});
    }
}

//Modificar un producto
const updateProduct = async (req, res) => {
    try{
        const { name } = req.body;
        const product = await productModel.findById(req.params.id);

        if(!product) return res.status(404).json({ message: "No se encontró el producto buscado"});

        if(!name) return res.status(400).json({ message: "El nombre es obligatorio"});
        if(!validation.validateName(name)) return res.status(400).json({ message: "Nombre inválido"});

        const repeatedName = await productModel.findOne({ name });
        if(repeatedName && !repeatedName._id.equals(product._id)) return res.status(400).json({message: "Ya existe un producto con ese nombre"});

        product.name = name;
        await product.save();

        return res.status(200).json({
            product,
            message: "Producto modificado con éxito"
        });
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

//Eliminar un producto, sus variedades y sus ofertas
const deleteProduct = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const product = await productModel.findById(req.params.id).session(session);
        if(!product){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message: "El producto que desea eliminar no existe"});
        }
        if(product.isActive){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: "Solo puede eliminar productos inactivos"});
        }
        
        const varieties = await varietyModel.find({productId: product._id}).session(session);
        
        for(let variety of varieties){
            await offerModel.deleteMany({varietyId: variety._id}).session(session);
        }
        await varietyModel.deleteMany({productId: product._id}).session(session);

        await productModel.findByIdAndDelete(req.params.id).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            product,
            message: "El producto fue eliminado con éxito junto a sus variedades y ofertas",
        });
    }
    catch (error) {
        
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: error.message});
    }
}

//Desactivar un producto, sus variedades y sus ofertas
const deactivate = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const product = await productModel.findById(req.params.id).session(session);
        if(!product){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "El producto no existe"})
        };
        
        const varieties = await varietyModel.find({productId: product._id}).session(session);
        for(let i = 0; i < varieties.length; i++){
            
            const offers = await offerModel.find({varietyId: varieties[i]._id}).session(session);
            for(let j = 0; j < offers.length; j++){
                offers[j].isActive = false;
                await offers[j].save({session});
            }

            varieties[i].isActive = false;
            await varieties[i].save({session});
        }
        product.isActive = false;
        
        await product.save({session});

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({message: `El producto ${product.name} fue desactivado`});
    }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

//Activar un producto
const activate = async (req, res) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(!product) return res.status(404).json({ message: "El producto no existe"});
        product.isActive = true;
        await product.save();
        return res.status(200).json({message: `El producto ${product.name} fue activado`});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Buscar un producto por id
const getProductById = async (req, res) => {
    try{
        const product = await productModel.findById(req.params.id)
        if(!product) return res.status(404).json({ message: "El producto no existe"});
        
        const varieties = await varietyModel.find({productId: product._id});

        return res.status(200).json({
            product: {
                ...product._doc,
                varieties
            },
            message: "Producto encontrado con éxito"
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Buscar productos por filtros
const getAllProducts = async (req, res) => {
    try{
        const { activeProducts, activeVarieties, activeOffers } = req.query;

        let productsFilter = {};
        let varietiesFilter = {};
        let offersFilter = {};

        if(activeProducts) productsFilter.isActive = undefined;
        if(activeProducts?.toLowerCase() === "true") productsFilter.isActive = true;
        if(activeProducts?.toLowerCase() === "false") productsFilter.isActive = false;
        if(activeProducts?.toLowerCase() === "all") delete productsFilter.isActive;

        
        if(activeVarieties) varietiesFilter.isActive = undefined;
        if(activeVarieties?.toLowerCase() === "true") varietiesFilter.isActive = true;
        if(activeVarieties?.toLowerCase() === "false") varietiesFilter.isActive = false;
        if(activeVarieties?.toLowerCase() === "all") delete varietiesFilter.isActive;

        
        if(activeOffers) offersFilter.isActive = undefined;
        if(activeOffers?.toLowerCase() === "true") offersFilter.isActives = true;
        if(activeOffers?.toLowerCase() === "false") offersFilter.isActive = false;
        if(activeOffers?.toLowerCase() === "all") delete offersFilter.isActive;

        const products = await productModel.find(productsFilter);
        let responseArray = [];

        for(let i = 0; i < products.length; i++) {
            const varieties = await varietyModel.find({productId: products[i]._id, ...varietiesFilter});
            let varietiesWithOffers = [];
            
            for(let j = 0; j < varieties.length; j++){
                const offers = await offerModel.find({varietyId: varieties[j]._id, ...offersFilter});
                varietiesWithOffers.push({
                    ...varieties[j]._doc,
                    offers
                })
            } 
            responseArray.push({
                ...products[i]._doc,
                varieties: varietiesWithOffers
            });
        }
        
        return res.status(200).json({
            products: responseArray,
            message: "Productos encontrados con éxito"
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = {createProduct, updateProduct, deleteProduct, deactivate, activate, getProductById, getAllProducts};