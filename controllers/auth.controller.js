const userModel = require("../models/users.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validation = require("../helpers/validations.js");

const register = async (req, res) => {
    try{
        const {username, password, isAdmin, isEditor} = req.body;
        
        if(!validation.validateUsername(username)) return res.status(400).json({message: "Nombre de usuario inválido"});
        if(!validation.validatePassword(password)) return res.status(400).json({message: "Contraseña inválida"});
        
        const repeatedUsername = await userModel.findOne({username: username});
        if(repeatedUsername) return res.status(400).json({message: "El usuario ya existe"});
        const hash = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            isAdmin,
            isEditor,
            password: hash,
        });

        await newUser.save();
        return res.status(201).json({
            username,
            message: "Registro exitoso"
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const login = async (req, res) => {
    try{
        const {username, password} = req.body;

        if(!validation.validateUsername(username)) return res.status(401).json({message: "Nombre de usuario inválido"});
        if(!validation.validatePassword(password)) return res.status(401).json({message: "Contraseña inválida"});

        const user = await userModel.findOne({username: username});
        if(!user) return res.status(401).json({message: "Usuario o contraseña incorrecta"});
        
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect) return res.status(400).json({message: "Usuario o contraseña incorrecta"});
        
        if(!user.isActive) return res.status(400).json({message: "Inicie sesión con un usuario activo"});

        const token = jwt.sign(
            {_id: user._id, username: user.username, isAdmin: user.isAdmin, isEditor: user.isEditor, isActive: user.isActive},
            process.env.JWT, 
        );

        res.status(200).header("Authorization", `Bearer ${token}`).json({message: "Ingresó con éxito",
    token});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {register, login};