const express = require('express');

const AuthMiddleware = require('../middleware/auth.middleware');
const MessageController = require('../controllers/message.controllers');

const router = express.Router();

router.use((req, res, next)=>{
    console.log('Time: '+ Date.now(), `/api/mappoint${req.url}`);
    next();
});

router.get('/get', AuthMiddleware.checkAuthentication, MessageController.getMessages);

module.exports = router;