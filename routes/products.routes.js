const express = require('express');
const productController = require("../controllers/products.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/products", verifyEditor, productController.createProduct);
router.put("/products/:id", verifyEditor, productController.updateProduct);
router.delete("/products/:id", verifyEditor, productController.deleteProduct);
router.put("/products/activate/:id", verifyEditor, productController.activate);
router.put("/products/deactivate/:id", verifyEditor, productController.deactivate);
router.get("/products/:id", verifyUser, productController.getProductById);
router.get("/products/", verifyUser, productController.getAllProducts);

module.exports = router;