const express = require('express');
const cartController = require('../controllers/cartController')
const router = express.Router();

router.route("/")
    .get(cartController.getAllCarts)
    .post(cartController.createNewCart)

router.route("/deleteCart/:id")
    .get(cartController.deleteCartForm)
    .delete(cartController.deleteCart)

router.route("/:id")
    .get(cartController.getCartsByCartOwnerId)


module.exports = router