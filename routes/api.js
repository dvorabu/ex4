const path = require('path');

const express = require('express');

const apiController = require('../controllers/api');

const router = express.Router();

router.get('/checkEmail', apiController.fetchEmail);
router.post('/checkEmail', apiController.fetchEmail);
router.get('/saveImage', apiController.fetchImage);
router.post('/saveImage', apiController.fetchImage);
router.post('/getData', apiController.getAll);
router.post('/logout', apiController.logout);
router.delete('/delete', apiController.delete);
router.delete('/deleteAll', apiController.deleteAll);



module.exports = router;
