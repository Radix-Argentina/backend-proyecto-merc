const supplierModel = require("../models/suppliers.model.js");
const offerModel = require("../models/offers.model.js");
const validations = require("../helpers/validations.js");
const mongoose = require("mongoose");

//Crear un nuevo proveedor
const createSupplier = async (req, res) => {
    try {
        const { name, mail, phone, address, contact, country} = req.body;

        if(!name) return res.status(400).json({message: "El nombre es obligatorio"});
        if(!validations.validateName(name)) return res.status(400).json({message: "Nombre inválido"});

        const repeatedName = await supplierModel.findOne({ name });
        if(repeatedName) return res.status(400).json({message: "Ya existe un proveedor con ese nombre"});
        
        if(typeof mail == "string" && !validations.validateMail(mail)) return res.status(400).json({message: "Correo inválido"});
        if(typeof phone == "string"  && !validations.validatePhone(phone)) return res.status(400).json({message: "Teléfono inválido"});
        if(typeof address == "string" && !validations.validateAddress(address)) return res.status(400).json({message: "Dirección inválida"});
        if(typeof contact == "string" && !validations.validateContact(contact)) return res.status(400).json({message: "Contacto inválido"});
        if(typeof country == "string" && !validations.validateCountry(country)) return res.status(400).json({message: "País inválido"});


        const newSupplier = new supplierModel({ name, mail, phone, address, contact, country});
        await newSupplier.save();

        return res.status(201).json({
            newSupplier,
            message: "Proveedor agregado con éxito"
        });
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }
}

//Modificar un proveedor
const updateSupplier = async (req, res) => {
    try {
        const supplier = await supplierModel.findById(req.params.id);
        if(!supplier) return res.status(404).json({message: "El proveedor que desea modificar no existe"});

        if(req.body.name) supplier.name = req.body.name;
        if(req.body.phone) supplier.phone = req.body.phone;
        if(req.body.mail) supplier.mail = req.body.mail;
        if(req.body.address) supplier.address = req.body.address;
        if(req.body.contact) supplier.contact = req.body.contact;
        if(req.body.country) supplier.country = req.body.country;

        const repeatedName = await supplierModel.findOne({ name: supplier.name });
        if(repeatedName && !repeatedName._id.equals(supplier._id)) return res.status(400).json({message: "Ya existe un proveedor con ese nombre"});
        
        if(typeof supplier.mail == "string" && !validations.validateMail(supplier.mail)) return res.status(400).json({message: "Correo inválido"});
        if(typeof supplier.phone == "string"  && !validations.validatePhone(supplier.phone)) return res.status(400).json({message: "Teléfono inválido"});
        if(typeof supplier.address == "string" && !validations.validateAddress(supplier.address)) return res.status(400).json({message: "Dirección inválida"});
        if(typeof supplier.contact == "string" && !validations.validateContact(supplier.contact)) return res.status(400).json({message: "Contacto inválido"});
        if(typeof supplier.country == "string" && !validations.validateCountry(supplier.country)) return res.status(400).json({message: "País inválido"});

        await supplier.save();

        return res.status(200).json({
            supplier,
            message: "El proveedor se modificó con éxito"
        });
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }
}

//Eliminar un proveedor y sus ofertas
const deleteSupplier = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const supplier = await supplierModel.findById(req.params.id).session(session);
        if(!supplier){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message: "El proveedor que desea eliminar no existe"});
        }
        if(supplier.isActive){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: "Solo puede eliminar proveedores inactivos"});
        }
        
        await offerModel.deleteMany({supplierId: supplier._id}).session(session);

        await supplierModel.findByIdAndDelete(req.params.id).session(session);
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            supplier,
            message: "El proveedor y sus ofertas fueron eliminados con éxito",
        });
    }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: error.message});
    }
}

//Desactivar un proveedor y sus ofertas
const deactivate = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const supplier = await supplierModel.findById(req.params.id).session(session);
        if(!supplier){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "El proveedor no existe"});
        }
        
        const offers = await offerModel.find({supplierId: supplier._id}).session(session);
        for(let i = 0; i < offers.length; i++){
            offers[i].isActive = false;
            await offers[i].save({session});
        }
        supplier.isActive = false;
        
        await supplier.save({session});

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({message: `El proveedor ${supplier.name} fue desactivado`});
    }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

//Activar un proveedor
const activate = async (req, res) => {
    try{
        const supplier = await supplierModel.findById(req.params.id);
        if(!supplier) return res.status(404).json({ message: "El proveedor no existe"});
        supplier.isActive = true;
        await supplier.save();
        return res.status(200).json({message: `El proveedor ${supplier.name} fue activado`});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Buscar un proveedor por id
const getSupplierById = async (req, res) => {
    try{
        const supplier = await supplierModel.findById(req.params.id)
        if(!supplier) return res.status(404).json({ message: "El proveedor no existe"});
        
        const offers = await offerModel.find({supplierId: supplier._id}).populate({
            path: "varietyId",
            select: ["name", "productId", "_id", "isActive"],
            populate: {
                path: "productId",
                select: ["name", "_id", "isActive"]
            }
        });
        let responseArray = [];
        for(let offer of offers){
            let response = {
                ...offer._doc,
                product: {
                    ...offer.varietyId.productId._doc,
                    variety: {
                        ...offer.varietyId._doc,
                    }
                }
            }
            delete response.supplierId;
            delete response.varietyId;
            delete response.product.variety.productId;
            responseArray.push(response);
        }

        return res.status(200).json({
            supplier: {
                ...supplier._doc,
                offers: responseArray
            },
            message: "Proveedor encontrado con éxito"
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Buscar proveedores por filtros
const getAllSuppliers = async (req, res) => {
    try{
        const { isActive } = req.query;

        let filter = {};

        if(isActive) filter.isActive = undefined;
        if(isActive?.toLowerCase() === "true") filter.isActive = true;
        if(isActive?.toLowerCase() === "false") filter.isActive = false;
        if(isActive?.toLowerCase() === "all") delete filter.isActive;

        const suppliers = await supplierModel.find(filter);
        
        return res.status(200).json({
            suppliers,
            message: "Proveedores encontrados con éxito"
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createSupplier, updateSupplier, deleteSupplier, activate, deactivate, getSupplierById, getAllSuppliers};