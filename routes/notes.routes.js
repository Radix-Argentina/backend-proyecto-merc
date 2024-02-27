const express = require('express');
const notesController = require("../controllers/notes.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Crear una nota
router.post("/notes",  notesController.createNote);
//Modificar un nota
router.put("/notes/:id",  notesController.updateNote);
//Eliminar una nota
router.delete("/notes/:id",  notesController.deleteNote);
//Buscar todas las notas
router.get("/notes",  notesController.getAllNotes);
//Buscar una nota por id
router.get("/notes/:id",  notesController.getNoteById);

module.exports = router;