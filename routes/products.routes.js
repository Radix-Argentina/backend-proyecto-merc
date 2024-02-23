const express = require('express');
const productController = require("../controllers/products.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Crear un producto
router.post("/products", verifyEditor, productController.createProduct);
//Modificar producto
router.put("/products/:id", verifyEditor, productController.updateProduct);
//Eliminar producto
router.delete("/products/:id", verifyEditor, productController.deleteProduct);
//Activar producto
router.put("/products/activate/:id", verifyEditor, productController.activate);
//Desactivar producto
router.put("/products/deactivate/:id", verifyEditor, productController.deactivate);
//Buscar oferta por id
router.get("/products/:id", verifyUser, productController.getProductById);
//Buscar todos los productos
router.get("/products/", verifyUser, productController.getAllProducts);

module.exports = router;