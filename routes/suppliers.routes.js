const express = require('express');
const suppliersController = require("../controllers/suppliers.controller.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/suppliers", suppliersController.createSupplier);
router.put("/suppliers/:id", suppliersController.updateSupplier);
router.delete("/suppliers/:id", suppliersController.deleteSupplier);
router.put("/suppliers/activate/:id", suppliersController.activate);
router.put("/suppliers/deactivate/:id", suppliersController.deactivate);
router.get("/suppliers/:id", suppliersController.getSupplierById);
router.get("/suppliers", suppliersController.getAllSuppliers);

module.exports = router;