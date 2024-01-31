const express = require('express');
const productController = require("../controllers/products.controller");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/products", productController.createProduct);

module.exports = router;