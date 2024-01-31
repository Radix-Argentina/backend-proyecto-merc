const supplierModel = require("../models/suppliers.model.js");
const validations = require("../helpers/suppliers.validations.js");

const createSupplier = async (req, res) => {
    try {
        const { name, mail, phone, address} = req.body;

        if(!name) return res.status(400).json({message: "El nombre es obligatorio"});
        if(!validations.validateName(name)) return res.status(400).json({message: "Nombre inválido"});
        if(mail && !validations.validateMail(mail)) return res.status(400).json({message: "Correo inválido"});
        if(phone && !validations.validatePhone(phone)) return res.status(400).json({message: "Teléfono inválido"});
        if(address && !validations.validateAddress(address)) return res.status(400).json({message: "Dirección inválida"});

        const newSupplier = new supplierModel({ name, mail, phone, address});
        await newSupplier.save();

        return res.status(201).json({
            newSupplier,
            message: "Provedor agregado con éxito"
        });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = { createSupplier};