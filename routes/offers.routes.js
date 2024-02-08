const express = require('express');
const offersController = require("../controllers/offers.controller.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos

router.get("/offers/:id", offersController.getOfferById);
router.post("/offers/", offersController.createOffer);

module.exports = router;