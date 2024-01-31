const supplierModel = require("../models/suppliers.model.js");
const validations = require("../helpers/suppliers.validations.js");

const createSupplier = async (req, res) => {
    try {
        const { name, mail, phone, address} = req.body;

        if(!name) return res.status(400).json({message: "El nombre es obligatorio"});
        if(!validations.validateName(name)) return res.status(400).json({message: "Nombre inválido"});

        const repeatedName = await supplierModel.findOne({ name });
        if(repeatedName) return res.status(400).json({message: "Ya existe un provedor con ese nombre"});
        
        if(typeof mail == "string" && !validations.validateMail(mail)) return res.status(400).json({message: "Correo inválido"});
        if(typeof phone == "string"  && !validations.validatePhone(phone)) return res.status(400).json({message: "Teléfono inválido"});
        if(typeof address == "string" && !validations.validateAddress(address)) return res.status(400).json({message: "Dirección inválida"});

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

const updateSupplier = async (req, res) => {
    try {
        const supplier = await supplierModel.findById(req.params.id);
        if(!supplier) return res.status(404).json({message: "El provedor que desea modificar no existe"});

        if(req.body.name) supplier.name = req.body.name;
        if(req.body.phone) supplier.phone = req.body.phone;
        if(req.body.mail) supplier.mail = req.body.mail;
        if(req.body.address) supplier.address = req.body.address;

        const repeatedName = await supplierModel.findOne({ name: supplier.name });
        if(repeatedName && !repeatedName._id.equals(supplier._id)) return res.status(400).json({message: "Ya existe un provedor con ese nombre"});
        
        if(typeof supplier.mail == "string" && !validations.validateMail(supplier.mail)) return res.status(400).json({message: "Correo inválido"});
        if(typeof supplier.phone == "string"  && !validations.validatePhone(supplier.phone)) return res.status(400).json({message: "Teléfono inválido"});
        if(typeof supplier.address == "string" && !validations.validateAddress(supplier.address)) return res.status(400).json({message: "Dirección inválida"});

        await supplier.save();

        return res.status(200).json({
            supplier,
            message: "El provedor se modificó con éxito"
        });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deleteSupplier = async (req, res) => {
    try{
        const supplier = await supplierModel.findById(req.params.id);
        if(!supplier) return res.status(404).json({message: "El provedor que desea eliminar no existe"});
        if(supplier.isActive) return res.status(400).json({message: "Solo puede eliminar provedores inactivos"});
        
        await supplierModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            supplier,
            message: "El provedor fue eliminado con éxito",
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deactivate = async (req, res) => {
    try{
        const supplier = await supplierModel.findById(req.params.id);
        if(!supplier) return res.status(404).json({ message: "El provedor no existe"});
        supplier.isActive = false;
        await supplier.save();
        return res.status(200).json({message: `El provedor ${supplier.name} fue desactivado`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const activate = async (req, res) => {
    try{
        const supplier = await supplierModel.findById(req.params.id);
        if(!supplier) return res.status(404).json({ message: "El provedor no existe"});
        supplier.isActive = true;
        await supplier.save();
        return res.status(200).json({message: `El provedor ${supplier.name} fue activado`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createSupplier, updateSupplier, deleteSupplier, activate, deactivate};