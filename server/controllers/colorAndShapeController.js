const ColorAndShape = require('../models/colorsAndShapes')

exports.getAllColorsAndShapes = async (req, res, next) => {
    let color;
    let shape;
    try {
        [color] = await ColorAndShape.getColor();
        [shape] = await ColorAndShape.getShape()
        res.status(200).json({"colors": color, "shapes": shape})
    } catch (err) {
        res.json({"colors": [], "shapes": []})
        console.log(err)
    }
}

exports.createNewColor = async (req, res, next) => {
    try {
        let name = req.body.name
        let color = new ColorAndShape(name)
        color.saveColor()

        res.status(200)
    } catch (err) {
        console.log(err)
    }
}

exports.createNewShape = async (req, res, next) => {
    try {
        let name = req.body.name
        let shape = new ColorAndShape(name)
        shape.saveShape()

        res.status(200)
    } catch (err) {
        console.log(err)
    }
}

exports.deleteColor = async (req, res, next) => {
    try {
        let id = req.body.id
        ColorAndShape.deleteColor(id)

        res.status(200)
    } catch (err) {
        console.log(err)
    }
}

exports.deleteShape = async (req, res, next) => {
    try {
        let id = req.body.id
        ColorAndShape.deleteShape(id)

        res.status(200)
    } catch (err) {
        console.log(err)
    }
}