const notesModel = require("../models/notes.model.js");
const validation = require("../helpers/validations.js");

const createNote = async (req, res) => { //ACID
    try {
        const { title, text } = req.body;
        if(!title) return res.status(400).json({ message: "El título es obligatorio"});
        if(!validation.validateTitle(title)) return res.status(400).json({ message: "Título inválido"});
        if(text && !validation.validateText(text)) return res.status(400).json({ message: "Texto inválido"});
        
        const writerId = req.user._id;

        const note = new notesModel({
            title,
            text,
            writerId
        })

        await note.save();

        return res.status(201).json({
            note,
            message: `La nota fue creada con éxito`
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const updateNote = async (req, res) => { //ACID
    //Una nota puede ser editada por cualquier persona editor o admin??, o solo por el autor??
    try {
        const { title, text } = req.body;
        const note = await notesModel.findById(req.params.id);

        if(!note) return res.status(404).json({ message: "No se encontró la nota buscada"});

        if(title && !validation.validateTitle(title)) return res.status(400).json({ message: "Título inválido"});
        if(text && !validation.validateText(text)) return res.status(400).json({ message: "Texto inválido"});

        if(title) note.title = title;
        if(typeof text === "string") note.text = text;
        await note.save();

        return res.status(200).json({
            note,
            message: "Nota modificada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const deleteNote = async (req, res) => { //ACID
    //Cualquiera puede borrar cualquier nota?
    try {
        const note = await notesModel.findById(req.params.id);
        if(!note) return res.status(404).json({message: "La nota que desea eliminar no existe"});

        await notesModel.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({
            note,
            message: "La nota fue eliminada con éxito",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const getAllNotes = async (req, res) => { //ACID
    //Tal vez quieran agregar algun tipo de filtro aqui
    try{
        const notes = await notesModel.find().populate({
            path: "writerId",
            select: ["_id", "username", "isActive"]
        });

        let responseArray = [];
        for(let note of notes) {
            const response = {
                ...note._doc,
                writer: note.writerId
            }

            delete response.writerId;
            responseArray.push(response);
        }

        return res.status(200).json({
            message: "Notas encontradas con éxito",
            notes: responseArray
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const getNoteById = async (req, res) => { //ACID
    try{
        const note = await notesModel.findById(req.params.id).populate({
            path: "writerId",
            select: ["_id", "username", "isActive"]
        });
        if(!note) return res.status(404).json({ message: "La nota no existe"});

        const responseNote = {
            ...note._doc,
            writer: note.writerId
        }

        delete responseNote.writerId;

        return res.status(200).json({
            note: responseNote,
            message: "Nota encontrada con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {createNote, updateNote, deleteNote, getAllNotes, getNoteById};