const express = require('express');
const notesController = require("../controllers/notes.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

router.post("/notes", verifyEditor, notesController.createNote);
router.put("/notes/:id", verifyEditor, notesController.updateNote);
router.delete("/notes/:id", verifyEditor, notesController.deleteNote);
router.get("/notes", verifyEditor, notesController.getAllNotes);
router.get("/notes/:id", verifyEditor, notesController.getNoteById);

module.exports = router;