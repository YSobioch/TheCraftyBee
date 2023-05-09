const express = require('express');
const userControllers = require('../controllers/usersController');
const router = express.Router();

router.route("/")
        .get(userControllers.getAllUsers)
        .post(userControllers.createNewUser);

router.route("/updateUser/:name/:password")
        .get(userControllers.updateUserForm)
        .put(userControllers.updateUser)


router.route("/deleteUser/:name/:password")
        .get(userControllers.deleteUserForm)
        .delete(userControllers.deleteUser)
        
router.route("/:name/:password").get(userControllers.getUserByName);

module.exports = router;