const jwt = require('jsonwebtoken');
const userModel = require("../models/users.model.js");

const validateToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) return res.status(400).json({ message: "Token inválido" });
        const tokenParts = token.split(" ");
    
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(400).json({ message: "Token inválido" });
        }
        const jwtToken = tokenParts[1];
        const { _id } = jwt.verify(jwtToken, process.env.JWT);
    
        const user = await userModel.findById(_id);
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const verifyAdmin = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user.isAdmin) {
                next();
            } else {
                throw new Error("Acceso denegado");
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(401).json({message: "Acceso denegado"});
    }
}

const verifyEditor = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user.isAdmin || req.user.isEditor) {
                next();
            } else {
                throw new Error("Acceso denegado");
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(401).json({message: "Acceso denegado"});
    }
}

const verifyUser = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user._id) {
                next();
            } else {
                throw new Error("Acceso denegado");
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(401).json({message: "Acceso denegado"});
    }
}

module.exports = { verifyAdmin, verifyEditor, verifyUser};