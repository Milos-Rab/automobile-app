const express = require('express');
const AuthController = require('../controllers/auth.controllers');
const AuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use((req, res, next)=>{
    console.log('Time: '+ Date.now(), `/api/auth${req.url}`);
    next();
});

router.post('/signup', AuthController.register);
router.post('/login', AuthController.login);
router.get('/get', AuthMiddleware.checkAuthentication, AuthController.getUsers);

module.exports = router;