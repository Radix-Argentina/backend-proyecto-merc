const express = require('express');
const varietyController = require("../controllers/varieties.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos
router.post("/varieties/", verifyEditor, varietyController.createVariety);
router.put("/varieties/:id", verifyEditor, varietyController.updateVariety);
router.delete("/varieties/:id", verifyEditor, varietyController.deleteVariety);
router.put("/varieties/activate/:id", verifyEditor, varietyController.activate);
router.put("/varieties/deactivate/:id", verifyEditor, varietyController.deactivate);
router.get("/varieties/:id", verifyUser, varietyController.getVarietyById);
router.get("/varieties/", verifyUser, varietyController.getAllVarieties);

module.exports = router;