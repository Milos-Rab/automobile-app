const express = require('express');

const AuthMiddleware = require('../middleware/auth.middleware');
const MappointController = require('../controllers/mappoint.controller');

const router = express.Router();

router.use((req, res, next)=>{
    console.log('Time: '+ Date.now(), `/api/mappoint${req.url}`);
    next();
});

router.post('/create', AuthMiddleware.checkAuthentication, MappointController.create);
router.get('/get', MappointController.get);
router.get('/get/:id', MappointController.getOne);

module.exports = router;