const mongoose = require("mongoose");
const URI = process.env.URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
