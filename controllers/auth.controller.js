const userModel = require("../models/users.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.model.js");

const register = async (req, res) => {
    try{
        const {username, password, role} = req.body;
        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            role,
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

        const user = await usersModel.findOne({username: username});
        if(!user) return res.status(400).json({message: "Usuario o contraseña incorrecta"});
        
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect) return res.status(400).json({message: "Usuario o contraseña incorrecta"});
    
        const token = jwt.sign(
            {_id: user._id, username: user.username, role: user.role},
            process.env.JWT, 
        );

        res.status(200).header("Authorization", `Bearer ${token}`).json({message: "Ingresó con éxito"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}