const express = require('express');
const productController = require("../controllers/products.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Crear un producto
router.post("/products", productController.createProduct);
//Modificar producto
router.put("/products/:id",  productController.updateProduct);
//Eliminar producto
router.delete("/products/:id",  productController.deleteProduct);
//Activar producto
router.put("/products/activate/:id",  productController.activate);
//Desactivar producto
router.put("/products/deactivate/:id",  productController.deactivate);
//Buscar oferta por id
router.get("/products/:id",  productController.getProductById);
//Buscar todos los productos
router.get("/products/",  productController.getAllProducts);

module.exports = router;