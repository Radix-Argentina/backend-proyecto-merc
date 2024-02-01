const express = require('express');
const productController = require("../controllers/products.controller");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.put("/products/activate/:id", productController.activate);
router.put("/products/deactivate/:id", productController.deactivate);
router.get("/products/:id", productController.getProductById);
router.get("/products/", productController.getAllProducts);

module.exports = router;