const express = require('express');
const offersController = require("../controllers/offers.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Buscar una oferta por id
router.get("/offers/:id", verifyUser, offersController.getOfferById);
//Buscar ofertas
router.get("/offers/", verifyUser, offersController.getAllOffers);
//Crear oferta
router.post("/offers/", verifyEditor, offersController.createOffer);
//Modificar oferta
router.put("/offers/:id", verifyEditor, offersController.updateOffer);
//Eliminar ofertas
router.delete("/offers/:id", verifyEditor, offersController.deleteOffer);
//Activar oferta
router.put("/offers/activate/:id", verifyEditor, offersController.activate);
//Desactivar oferta
router.put("/offers/deactivate/:id", verifyEditor, offersController.deactivate);

module.exports = router;