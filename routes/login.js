const path = require('path');
const db = require('../models');
const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

router.use('/login',usersController.middleWare);
router.post('/register', usersController.postRegister);
router.get('/register', usersController.getRegister);
router.get('/', usersController.getLogin);
router.post('/homePage', usersController.postLogin);
router.get('/homePage', usersController.getLogin);
router.post('/password', usersController.postAddUser);

module.exports = router;
