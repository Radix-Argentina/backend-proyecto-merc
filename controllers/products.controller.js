const productModel = require("../models/products.model.js");
const varietyModel = require("../models/varieties.model.js");
const offerModel = require("../models/offers.model.js");
const validation = require("../helpers/validations.js");

const createProduct = async (req, res) => {
    try {
        const { name } = req.body;
        if(!name) return res.status(400).json({ message: "El nombre es obligatorio"});
        if(!validation.validateName(name)) return res.status(400).json({ message: "Nombre inválido"});

        const repeatedName = await productModel.findOne({ name });
        if(repeatedName) return res.status(400).json({message: "Ya existe un producto con ese nombre"});

        const product = new productModel({
            name
        });
        //Muy posiblemente cuando se cree el producto haya que crear una variedad con el, y si no se envia la informacion de la variedad, que cree una default
        await product.save();
        return res.status(201).json({
            product,
            message: "El producto fue creado con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

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
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deleteProduct = async (req, res) => { //Al borrar debe estar inactivo, y no puede borrarse si tiene variedades creadas
    try {
        const product = await productModel.findById(req.params.id);
        if(!product) return res.status(404).json({message: "El producto que desea eliminar no existe"});
        if(product.isActive) return res.status(400).json({message: "Solo puede eliminar productos inactivos"});
        
        const varieties = await varietyModel.find({productId: product._id});
        
        if(varieties.length > 0) return res.status(400).json({message: "No se puede eliminar un producto con variedades creadas"});

        await productModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            product,
            message: "El producto fue eliminado con éxito",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deactivate = async (req, res) => { //Desactivar un proveedor implica desactivar sus varieties y desactivar sus varieties implica desactivar sus  offers
    //Aca se anidan 2 for para descativar todo:
    //OP1: no hacerlo y que el usuario lo haga a mano
    //OP2: hacerlo y rezar que no ocurran inconsistencias por no ser atomica (Esta esta desarrollada)
    try{
        const product = await productModel.findById(req.params.id);
        if(!product) return res.status(404).json({ message: "El producto no existe"});
        
        const varieties = await varietyModel.find({productId: product._id}); //Probar si desactiva todas las variedades
        for(let i = 0; i < varieties.length; i++){
            
            const offers = await offerModel.find({varietyId: varieties[i]._id});
            for(let j = 0; j < offers.length; j++){
                offers[i].isActive = false;
                await offers[i].save();
            }

            varieties[i].isActive = false;
            await varieties[i].save();
        }
        product.isActive = false;
        
        await product.save();
        return res.status(200).json({message: `El producto ${product.name} fue desactivado`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const activate = async (req, res) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(!product) return res.status(404).json({ message: "El producto no existe"});
        product.isActive = true;
        await product.save();
        return res.status(200).json({message: `El producto ${product.name} fue activado`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getProductById = async (req, res) => { //Aqui se devuelve el producto con sus variedades, pero capaz sea funcional que devuelva a su vez las variedades con las offers
    //Si no se lo requiere en el front conviene que mande solo las variedades asi no manda de más
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
        console.log(error);
        res.status(500).json({ message: error.message });
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
        let responseArray = [];

        for(let i = 0; i < products.length; i++) {
            const varieties = await varietyModel.find({productId: products[i]._id});
            responseArray.push({
                ...products[i]._doc,
                varieties
            });
        }
        
        return res.status(200).json({
            products: responseArray,
            message: "Productos encontrados con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {createProduct, updateProduct, deleteProduct, deactivate, activate, getProductById, getAllProducts};