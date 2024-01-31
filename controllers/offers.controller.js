const offerModel = require("../models/offers.model.js");

const getOffer = async (req, res) => {
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

module.exports = {getOffer};