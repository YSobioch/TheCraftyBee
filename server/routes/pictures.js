const express = require('express');
const pictureControllers = require('../controllers/pictureControllers');
const router = express.Router();

router.route("/")
        .get(pictureControllers.getAllPictures)
        .post(pictureControllers.createNewPicture);

router.route("/:id").get(pictureControllers.getPictureById);

module.exports = router;