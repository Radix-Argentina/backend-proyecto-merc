const userModel = require("../models/users.model.js");
const bcrypt = require("bcrypt");

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
        const users = await userModel.find();
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

const updateUserInfo = async (req, res) => { //Hay que hacer el sistema de autenticacion antes
    try{
        const user = await userModel.findById(req.params.id);
        if(user){
            if(req.body.username) user.username = req.body.username;
            if(req.body.password) user.password = req.body.password;
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

module.exports = {getUserById, getAllUsers};