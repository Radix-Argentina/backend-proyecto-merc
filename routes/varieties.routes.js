const express = require('express');
const varietyController = require("../controllers/varieties.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Crear variedad
router.post("/varieties/",  varietyController.createVariety);
//Modificar variedad
router.put("/varieties/:id",  varietyController.updateVariety);
//Eliminar variedad
router.delete("/varieties/:id",  varietyController.deleteVariety);
//Activar variedad
router.put("/varieties/activate/:id",  varietyController.activate);
//Desactivar variedad
router.put("/varieties/deactivate/:id",  varietyController.deactivate);
//Buscar variedad por id
router.get("/varieties/:id",  varietyController.getVarietyById);
//Buscar todas las variedad
router.get("/varieties/",  varietyController.getAllVarieties);

module.exports = router;