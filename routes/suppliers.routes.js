const express = require('express');
const suppliersController = require("../controllers/suppliers.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/suppliers", verifyEditor, suppliersController.createSupplier);
router.put("/suppliers/:id", verifyEditor, suppliersController.updateSupplier);
router.delete("/suppliers/:id", verifyEditor, suppliersController.deleteSupplier);
router.put("/suppliers/activate/:id", verifyEditor, suppliersController.activate);
router.put("/suppliers/deactivate/:id", verifyEditor, suppliersController.deactivate);
router.get("/suppliers/:id", verifyUser, suppliersController.getSupplierById);
router.get("/suppliers", verifyUser, suppliersController.getAllSuppliers);

module.exports = router;