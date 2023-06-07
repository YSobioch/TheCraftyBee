const express = require('express');
const pictureControllers = require('../controllers/pictureControllers');
const router = express.Router();

router.route("/")
        .get(pictureControllers.getAllPictures)
        .post(pictureControllers.createNewPicture);

router.route("/deletePicture/:name")
        .delete(pictureControllers.deletePicture)

router.route("/getPictureNameById/:id")
        .get(pictureControllers.getPictureNameById)

router.route("/:id").get(pictureControllers.getPictureById);

module.exports = router;