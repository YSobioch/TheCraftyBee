const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({welcome: "welcome to the crafty bee"})
})

module.exports = router;