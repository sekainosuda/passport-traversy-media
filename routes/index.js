//jshint esversion:7
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('Welcome'));

module.exports = router;
