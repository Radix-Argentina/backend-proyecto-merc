const express = require('express');
const usersController = require("../controllers/users.controller.js");
const {verifyAdmin} = require("../helpers/permissions.validation.js");

const router = express.Router();

router.get("/users", verifyAdmin, usersController.getAllUsers);
router.get("/users/:id", verifyAdmin, usersController.getUserById);
router.put("/users/setAdminTrue/:id", verifyAdmin, usersController.setAdminTrue);
router.put("/users/setAdminFalse/:id", verifyAdmin, usersController.setAdminFalse);
router.put("/users/setEditorTrue/:id", verifyAdmin, usersController.setEditorTrue);
router.put("/users/setEditorFalse/:id", verifyAdmin, usersController.setEditorFalse);

module.exports = router;