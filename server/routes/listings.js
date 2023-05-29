const express = require('express');
const listingControllers = require('../controllers/listingControllers');
const router = express.Router();

router.route("/").get(listingControllers.getAllListings).post(listingControllers.createNewListing);

router.route("/listingsInCollection").get(listingControllers.getAllListingsInCollection);

router.route("/:id").get(listingControllers.getListingById);

module.exports = router;