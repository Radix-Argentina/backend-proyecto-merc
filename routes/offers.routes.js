const express = require('express');
const offersController = require("../controllers/offers.controller.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos

router.get("/offers/:id", offersController.getOfferById);
router.post("/offers/", offersController.createOffer);
router.put("/offers/:id", offersController.updateOffer);
router.delete("/offers/:id", offersController.deleteOffer);
router.put("/offers/activate/:id", offersController.activate);
router.put("/offers/deactivate/:id", offersController.deactivate);

module.exports = router;