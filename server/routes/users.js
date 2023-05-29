const express = require('express');
const userControllers = require('../controllers/usersController');
const router = express.Router();

router.route("/")
        .get(userControllers.getAllUsers)
        .post(userControllers.createNewUser);

router.route("/updateUserPassword")
        .put(userControllers.changePassword)

router.route("/updateUserSubscription")
        .put(userControllers.changeSubscriptionStatus)

router.route("/deleteUser/:name/:password")
        .get(userControllers.deleteUserForm)
        .delete(userControllers.deleteUser)
        
router.route("/:email/:password").get(userControllers.getUserByEmail);

module.exports = router;