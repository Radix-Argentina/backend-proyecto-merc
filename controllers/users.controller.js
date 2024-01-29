const userModel = require("../models/users.model.js");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find();
        res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {getUser, getAllUsers};