const express = require('express')
const colorAndShape = require('../controllers/colorAndShapeController')
const router = express.Router()

router.route("/")
    .get(colorAndShape.getAllColorsAndShapes)

router.route("/color")
    .post(colorAndShape.createNewColor)
    .put(colorAndShape.updateColor)
    .delete(colorAndShape.deleteColor)

router.route("/shape")
    .post(colorAndShape.createNewShape)
    .put(colorAndShape.updateShape)
    .delete(colorAndShape.deleteShape)


module.exports = router