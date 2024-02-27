const express = require('express');
const usersController = require("../controllers/users.controller.js");
const {verifyAdmin, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Buscar todos los usuarios
router.get("/users",  usersController.getAllUsers);
//Buscar usuario por id
router.get("/users/:id",  usersController.getUserById);
//Activar usuario
router.put("/users/activate/:id",  usersController.activate);
//Desactivar usuario
router.put("/users/deactivate/:id",  usersController.deactivate);
//Modificar usuario
router.put("/users/:id",  usersController.updateUserInfo);
//Eliminar usuario
router.delete("/users/:id",  usersController.deleteUser);

module.exports = router;