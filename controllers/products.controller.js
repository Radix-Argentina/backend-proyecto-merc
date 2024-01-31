const productModel = require("../models/products.model.js");
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

module.exports = {createProduct};