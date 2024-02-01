const productModel = require("../models/products.model.js");
const varietyModel = require("../models/varieties.model.js");
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
            name,
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

module.exports = {createProduct, updateProduct, deleteProduct};