const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./database/db.js");
const usersRoute = require("./routes/users.routes.js");
const authRoute = require("./routes/auth.routes.js");
const suppliersRoute = require("./routes/suppliers.routes.js");


// Crear aplicacion de backend

const app = express();
const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

// Directorio publico

app.use(express.static("public"));

// TODO Poner rutas aqui
app.use("/api", usersRoute);
app.use("/api", authRoute);
app.use("/api", suppliersRoute);

// Escucha del servidor

(async () => await connectDB())();

app.listen(port, () =>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})
