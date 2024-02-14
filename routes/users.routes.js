const express = require('express');
const usersController = require("../controllers/users.controller.js");
const {verifyAdmin, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

router.get("/users", verifyAdmin, usersController.getAllUsers);
router.get("/users/:id", verifyAdmin, usersController.getUserById); //Tal vez este sea posible para cualquier user si es uno mismo
// buscar sin filtro  --->  http://localhost:5500/api/users
// buscar activos  --->  http://localhost:5500/api/users?isActive=true
// buscar inactivos  --->  http://localhost:5500/api/users?isActive=false
// podes buscar tambien por admin  --->  http://localhost:5500/api/users?isAdmin=true
// o con 2 filtros  --->  http://localhost:5500/api/users?isActive=false&isAdmin=false
// analogo para editor TAMBIEN PODES PONER "all" para que muestro tanto los true como los false
router.put("/users/activate/:id", verifyAdmin, usersController.activate);
router.put("/users/deactivate/:id", verifyAdmin, usersController.deactivate); //Un admin no puede desactivarse a el mismo
router.put("/users/:id", verifyUser, usersController.updateUserInfo);
router.delete("/users/:id", verifyAdmin, usersController.deleteUser); //Un admin no puede eliminarse a el mismo

module.exports = router;