const express = require('express');
const varietyController = require("../controllers/varieties.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Crear variedad
router.post("/varieties/", verifyEditor, varietyController.createVariety);
//Modificar variedad
router.put("/varieties/:id", verifyEditor, varietyController.updateVariety);
//Eliminar variedad
router.delete("/varieties/:id", verifyEditor, varietyController.deleteVariety);
//Activar variedad
router.put("/varieties/activate/:id", verifyEditor, varietyController.activate);
//Desactivar variedad
router.put("/varieties/deactivate/:id", verifyEditor, varietyController.deactivate);
//Buscar variedad por id
router.get("/varieties/:id", verifyUser, varietyController.getVarietyById);
//Buscar todas las variedad
router.get("/varieties/", verifyUser, varietyController.getAllVarieties);

module.exports = router;