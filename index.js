const express = require("express");
require("dotenv").config();
const cors = require("cors");


// Crear aplicacion de backend

const app = express();
const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());

// Directorio publico

app.use(express.static("public"));

// TODO Poner rutas aqui


// Escucha del servidor

app.listen(port, () =>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})
