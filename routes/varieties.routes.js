const express = require('express');
const varietyController = require("../controllers/varieties.controller.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/varieties/", varietyController.createVariety);
router.put("/varieties/:id", varietyController.updateVariety);
router.delete("/varieties/:id", varietyController.deleteVariety);
router.put("/varieties/activate/:id", varietyController.activate);
router.put("/varieties/deactivate/:id", varietyController.deactivate);

module.exports = router;