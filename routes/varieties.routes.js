const express = require('express');
const varietyController = require("../controllers/varieties.controller.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/varieties/", varietyController.createVariety);
router.put("/varieties/:id", varietyController.updateVariety);

module.exports = router;