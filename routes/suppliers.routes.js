const express = require('express');
const suppliersController = require("../controllers/suppliers.controller.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/suppliers", suppliersController.createSupplier);
router.put("/suppliers/:id", suppliersController.updateSupplier);
router.delete("/suppliers/:id", suppliersController.deleteSupplier);

module.exports = router;