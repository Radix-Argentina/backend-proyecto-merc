const userModel = require("../models/users.model.js");
const bcrypt = require("bcrypt");
const validation = require("../helpers/validations.js");

//Buscar usuario por id
const getUserById = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        return res.status(200).json({
            user,
            message: "Usuario encontrado con éxito"
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Buscar usuarios por filtros
const getAllUsers = async (req, res) => {
    try{
        const { isActive, isAdmin, isEditor } = req.query;

        let filter = {};

        if(isActive) filter.isActive = undefined;
        if(isActive?.toLowerCase() === "true") filter.isActive = true;
        if(isActive?.toLowerCase() === "false") filter.isActive = false;
        if(isActive?.toLowerCase() === "all") delete filter.isActive;

        if(isAdmin) filter.isAdmin = undefined;
        if(isAdmin?.toLowerCase() === "true") filter.isAdmin = true;
        if(isAdmin?.toLowerCase() === "false") filter.isAdmin = false;
        if(isAdmin?.toLowerCase() === "all") delete filter.isAdmin;
        
        if(isEditor) filter.isEditor = undefined;
        if(isEditor?.toLowerCase() === "true") filter.isEditor = true;
        if(isEditor?.toLowerCase() === "false") filter.isEditor = false;
        if(isEditor?.toLowerCase() === "all") delete filter.isEditor;

        const users = await userModel.find(filter);
        return res.status(200).json({
            users,
            message: "Usuarios encontrados con éxito"
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Modificar un usuario
const updateUserInfo = async (req, res) => {
    try{
        if(!req.user.isAdmin && req.user._id != req.params.id) return res.status(401).json({message: "No tienes autorización para modificar este usuario"});
        const user = await userModel.findById(req.params.id);
        if(user){
            if(req.user.isAdmin){
                if(typeof req.body.isAdmin === "boolean") user.isAdmin = req.body.isAdmin;
                if(typeof req.body.isEditor === "boolean") user.isEditor = req.body.isEditor;
            }
            if(req.body?.username) user.username = req.body.username;
            if(req.body?.password) {
                if(!req.body.oldPassword) return res.status(400).json({message: "Para cambiar la contraseña ingrese la contraseña antigua"});
                if(req.user.isAdmin){
                    const admin = await userModel.findById(req.user._id);
                    if(!admin) return res.status(500).json({ message: "Ha ocurrido un error inesperado, intente mas tarde" });
                    if(!(await bcrypt.compare(req.body.oldPassword, admin.password)) && !(await bcrypt.compare(req.body.oldPassword, user.password))) return res.status(400).json({message: "Contraseña antigua incorrecta"});
                }
                else{
                    if(!(await bcrypt.compare(req.body.oldPassword, user.password))) return res.status(400).json({message: "Contraseña antigua incorrecta"});
                }
                
                const hash = await bcrypt.hash(req.body.password, 10)
                user.password = hash;
            };
            if(!validation.validateUsername(user.username)) return res.status(400).json({message: "Nombre de usuario inválido"});
            
            const repeatedUsername = await userModel.findOne({username: user.username});
            if(repeatedUsername && !repeatedUsername._id.equals(user._id)) return res.status(400).json({message: "El nombre de usuario ya está en uso"});

            if(req.body.password && !validation.validatePassword(req.body?.password)) return res.status(400).json({message: "Contraseña inválida"});

            await user.save();
            return res.status(200).json({message: "El usuario fue modificado con éxito"});
        }
        else{
            return res.status(404).json({ message: "El usuario que se quiere modificar no existe"});
        }
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Eliminar un usuario
const deleteUser = async (req, res) => {
	try {
        if(req.user._id == req.params.id) return res.status(400).json({message: "No puedes eliminarte a ti mismo"});
        const user = await userModel.findById(req.params.id);
        if(user.isActive){
            return res.status(400).json({message: "Solo se pueden eliminar usuarios no activos"});
        }
        else{
            await userModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({message: "El usuario se eliminó con éxito"});
        }
	} catch (error) {
        res.status(500).json({ message: error.message });
	}
}

//Desactivar un usuario
const deactivate = async (req, res) => {
    try{
        if(req.user._id == req.params.id) return res.status(400).json({message: "No puedes desactivarte a ti mismo"});
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isActive = false;
        await user.save();
        return res.status(200).json({message: `${user.username} fue desactivado`});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Activar un usuario
const activate = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "El usuario no existe"});
        user.isActive = true;
        await user.save();
        return res.status(200).json({message: `${user.username} fue activado`});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = {getUserById, getAllUsers, updateUserInfo, deleteUser, deactivate, activate};