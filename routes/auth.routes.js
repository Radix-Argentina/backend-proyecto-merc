const express = require('express');
const authController = require("../controllers/auth.controller.js");
const {verifyAdmin} = require("../helpers/permissions.validation.js");

const router = express.Router();

router.post("/register", verifyAdmin, authController.register);
router.post("/login", authController.login);

module.exports = router;