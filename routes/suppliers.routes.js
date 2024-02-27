const express = require('express');
const suppliersController = require("../controllers/suppliers.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Crear proveedor
router.post("/suppliers",  suppliersController.createSupplier);
//Modificar proveedor
router.put("/suppliers/:id",  suppliersController.updateSupplier);
//Eliminar proveedor
router.delete("/suppliers/:id",  suppliersController.deleteSupplier);
//Activar proveedor
router.put("/suppliers/activate/:id",  suppliersController.activate);
//Descartivar proveedor
router.put("/suppliers/deactivate/:id",  suppliersController.deactivate);
//Buscar proveedor por id
router.get("/suppliers/:id",  suppliersController.getSupplierById);
//Buscar todos proveedores
router.get("/suppliers",  suppliersController.getAllSuppliers);

module.exports = router;