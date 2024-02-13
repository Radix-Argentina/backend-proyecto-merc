const express = require('express');
const offersController = require("../controllers/offers.controller.js");
const {verifyEditor, verifyUser} = require("../middlewares/permissions.js");

const router = express.Router();
//Falta ponerle los middlewares de permisos

router.get("/offers/:id", verifyUser, offersController.getOfferById);
router.get("/offers/", verifyUser, offersController.getAllOffers);
router.post("/offers/", verifyEditor, offersController.createOffer);
router.put("/offers/:id", verifyEditor, offersController.updateOffer);
router.delete("/offers/:id", verifyEditor, offersController.deleteOffer);
router.put("/offers/activate/:id", verifyEditor, offersController.activate);
router.put("/offers/deactivate/:id", verifyEditor, offersController.deactivate);

module.exports = router;