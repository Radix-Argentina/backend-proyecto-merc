const userModel = require("../models/users.model.js");
const bcrypt = require("bcrypt");
const validation = require("../helpers/auth.validation.js");

const getUserById = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        return res.status(200).json({
            user,
            message: "Usuario encontrado con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try{
        const { isActive, isAdmin, isEditor } = req.query;

        let filter = {};

        if(isActive) filter.isActive = undefined;
        if(isActive?.toLowerCase() === "true") filter.isActive = true;
        if(isActive?.toLowerCase() === "false") filter.isActive = false;

        if(isAdmin) filter.isAdmin = undefined;
        if(isAdmin?.toLowerCase() === "true") filter.isAdmin = true;
        if(isAdmin?.toLowerCase() === "false") filter.isAdmin = false;
        
        if(isEditor) filter.isEditor = undefined;
        if(isEditor?.toLowerCase() === "true") filter.isEditor = true;
        if(isEditor?.toLowerCase() === "false") filter.isEditor = false;

        const users = await userModel.find(filter);
        return res.status(200).json({
            users,
            message: "Usuarios encontrados con éxito"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const setAdminTrue = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isAdmin = true;
        await user.save();
        return res.status(200).json({message: `${user.username} ahora es administrador`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const setAdminFalse = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isAdmin = false;
        await user.save();
        return res.status(200).json({message: `${user.username} ya no es administrador`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const setEditorFalse = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isEditor = false;
        await user.save();
        return res.status(200).json({message: `${user.username} ya no es editor`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const setEditorTrue = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isEditor = true;
        await user.save();
        return res.status(200).json({message: `${user.username} ahora es editor`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const updateUserInfo = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(user){
            if(req.body?.username) user.username = req.body.username;
            if(req.body?.password) user.password = req.body.password;

            if(!validation.validateUsername(req.body?.username)) return res.status(400).json({message: "Nombre de usuario inválido"});
            if(!validation.validatePassword(req.body?.password)) return res.status(400).json({message: "Contraseña inválida"});

            await user.save();
            return res.status(200).json({message: "El usuario fue modificado con éxito"});
        }
        else{
            return res.status(404).json({ message: "El usuario que se quiere modificar no existe"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => { //Solo se puede eliminar completamente un usuario desactivado
	try {
        const user = await userModel.findById(req.params.id);
        if(user.isActive){
            return res.status(400).json("Solo se pueden eliminar usuarios no activos");
        }
        else{
            await userModel.findByIdAndDelete(req.params.id);
            return res.status(200).json("El usuario se eliminó con éxito");
        }
	} catch (error) {
		console.log(error);
        res.status(500).json({ message: error.message });
	}
}

const deactivate = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isActive = false;
        await user.save();
        return res.status(200).json({message: `${user.username} fue desactivado`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const activate = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isActive = true;
        await user.save();
        return res.status(200).json({message: `${user.username} fue activado`});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {getUserById, getAllUsers, setAdminFalse, setAdminTrue, setEditorFalse, setEditorTrue, updateUserInfo, deleteUser, deactivate, activate};