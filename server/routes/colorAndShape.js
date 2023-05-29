const express = require('express')
const colorAndShape = require('../controllers/colorAndShapeController')
const router = express.Router()

router.route("/")
    .get(colorAndShape.getAllColorsAndShapes)

router.route("/color")
    .post(colorAndShape.createNewColor)
    .delete(colorAndShape.deleteColor)

router.route("/shape")
    .post(colorAndShape.createNewShape)
    .delete(colorAndShape.deleteShape)


module.exports = router