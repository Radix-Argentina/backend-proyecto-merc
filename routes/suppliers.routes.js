const express = require('express');
const suppliersController = require("../controllers/suppliers.controller.js");

const router = express.Router();

router.post("/suppliers", suppliersController.createSupplier);

module.exports = router;