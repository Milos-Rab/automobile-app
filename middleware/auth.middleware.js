const jwt = require('jsonwebtoken');

const checkAuthentication = (req, res, next) => {
  const token = req.headers["x-access-token"];
  const PRIVATE_KEY = "JSONWEBTOKEN_PRIVATE_KEY";
  jwt.verify(token, PRIVATE_KEY, function(err, decoded){
    if(err){
      return res.status(401).send({
        error: true,
        message: 'Unauthorized, please login.'
      });
    }
    if(decoded.userId){
      req.userId = decoded.userId;
      next();
    }else{
      return res.status(400).send({
        error: true,
        message: "Invalid token"
      })
    }
  })
}

module.exports = {
  checkAuthentication,
}