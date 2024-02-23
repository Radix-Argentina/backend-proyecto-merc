const express = require('express');
const usersController = require("../controllers/users.controller.js");
const {verifyAdmin, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Buscar todos los usuarios
router.get("/users", verifyAdmin, usersController.getAllUsers);
//Buscar usuario por id
router.get("/users/:id", verifyAdmin, usersController.getUserById);
//Activar usuario
router.put("/users/activate/:id", verifyAdmin, usersController.activate);
//Desactivar usuario
router.put("/users/deactivate/:id", verifyAdmin, usersController.deactivate);
//Modificar usuario
router.put("/users/:id", verifyUser, usersController.updateUserInfo);
//Eliminar usuario
router.delete("/users/:id", verifyAdmin, usersController.deleteUser);

module.exports = router;