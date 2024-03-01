const jwt = require('jsonwebtoken');
const userModel = require("../models/users.model.js");

//Función que comprueba la existencia de un token y si corresponde a un usuario válido lo pone a disposición de todo el sistema en req.user
const validateToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) return res.status(401).json({ message: "Token inválido" });
        const tokenParts = token.split(" ");
    
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ message: "Token inválido" });
        }
        const jwtToken = tokenParts[1];
        const { _id } = jwt.verify(jwtToken, process.env.JWT);
    
        const user = await userModel.findById(_id);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

//Comprueba que el usuario sea administrador
const verifyAdmin = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user?.isActive && req.user?.isAdmin) { 
                next();
            } else {
                throw new Error("Acceso denegado");
            }
        });
    }
    catch(error){
        res.status(401).json({message: "Acceso denegado"});
    }
}

//Comprueba que el usuario sea editor, en su defecto administrador
const verifyEditor = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user?.isActive && req.user.isAdmin || req.user?.isEditor) {
                next();
            } else {
                throw new Error("Acceso denegado");
            }
        });
    }
    catch(error){
        res.status(401).json({message: "Acceso denegado"});
    }
}

//Comprueba que haya un usuario logueado
const verifyUser = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user?.isActive && req.user?._id) {
                next();
            } else {
                throw new Error("Acceso denegado");
            }
        });
    }
    catch(error){
        res.status(401).json({message: "Acceso denegado"});
    }
}

module.exports = { verifyAdmin, verifyEditor, verifyUser};