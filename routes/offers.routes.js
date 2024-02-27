const express = require('express');
const offersController = require("../controllers/offers.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();

//RUTAS

//Buscar una oferta por id
router.get("/offers/:id",  offersController.getOfferById);
//Buscar ofertas
router.get("/offers/", offersController.getAllOffers);
//Crear oferta
router.post("/offers/",  offersController.createOffer);
//Modificar oferta
router.put("/offers/:id",  offersController.updateOffer);
//Eliminar ofertas
router.delete("/offers/:id",  offersController.deleteOffer);
//Activar oferta
router.put("/offers/activate/:id",  offersController.activate);
//Desactivar oferta
router.put("/offers/deactivate/:id",  offersController.deactivate);

module.exports = router;