const offerModel = require("../models/offers.model.js");

const createOffer = async (req, res) => {
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

const getOfferById = async (req, res) => {
    try{
        const offer = await offerModel.getById(req.params.id).populate({
            path: "supplierId",
            select: ["name"] //Podría devolver mas informacion pero por ahora lo dejo asi
        }).populate({
            path: "varietyId",
            select: ["name","_id"],
            populate: {
                path: "_id",
                select: ["name"],
            }
        });
        if(!offer) return res.status(404).json({message: "La oferta buscada no existe"});
        return res.status(200).json({
            offer,
            message: "Oferta encontrada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {getOfferById};