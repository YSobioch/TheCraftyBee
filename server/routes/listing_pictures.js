const express = require('express');
const lP = require('../controllers/listing_picturesController');
const router = express.Router();

router.route("/")
        .get(lP.getAllListing_Pictures)
        .post(lP.createNewListing_Picture)
        .delete(lP.deleteAllListing_PicturesByListingId)

router.route("/:id").get(lP.getListing_PicturesByListingId);

module.exports = router;