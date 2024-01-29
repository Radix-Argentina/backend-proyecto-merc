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
router.put("/users/:id", verifyAdmin, usersController.updateUserInfo); //Tal vez el admin no sea el unico que pueda editar un usuario
router.delete("/users/:id", verifyAdmin, usersController.deleteUser);

module.exports = router;