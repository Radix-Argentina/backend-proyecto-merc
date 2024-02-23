const express = require('express');
const suppliersController = require("../controllers/suppliers.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Crear proveedor
router.post("/suppliers", verifyEditor, suppliersController.createSupplier);
//Modificar proveedor
router.put("/suppliers/:id", verifyEditor, suppliersController.updateSupplier);
//Eliminar proveedor
router.delete("/suppliers/:id", verifyEditor, suppliersController.deleteSupplier);
//Activar proveedor
router.put("/suppliers/activate/:id", verifyEditor, suppliersController.activate);
//Descartivar proveedor
router.put("/suppliers/deactivate/:id", verifyEditor, suppliersController.deactivate);
//Buscar proveedor por id
router.get("/suppliers/:id", verifyUser, suppliersController.getSupplierById);
//Buscar todos proveedores
router.get("/suppliers", verifyUser, suppliersController.getAllSuppliers);

module.exports = router;