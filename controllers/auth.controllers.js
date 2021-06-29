const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  User.findOne({ email: email }).then(us => {
    if (us) {
      return res.status(400).send({
        error: false,
        message: 'Your email is already exists.'
      });
    }
    User.findOne({ name: name }).then(async ur => {
      if (ur) {
        return res.status(400).send({
          error: true,
          message: 'Your name is already exists.'
        })
      }
      const passwordHash = bcrypt.hashSync(password, 8);
      const user = new User({
        name: name,
        email: email,
        password: passwordHash,
        role: ['USER'],
      })
      await user.save();
      res.send({
        error: false,
        message: "Successfully signup."
      });
    });
  }).catch(err => {
    console.log(err.message);
    res.status(500).send({
      error: true,
      message: 'Internal Server Error.',
    });
  });
}

function login(req, res) {
  const { email, password } = req.body;
  User.findOne({ email: email }).then(us => {
    if (!us) {
      return res.status(401).send({
        error: true,
        message: 'Email or password is incorrect.',
      });
    }
    bcrypt.compare(password, us.password).then((result) => {
      if (result === true) {
        const PRIVATE_KEY = "JSONWEBTOKEN_PRIVATE_KEY";
        const token = jwt.sign(
          {
            userId: us._id,
            name: us.name,
          }, 
          PRIVATE_KEY,
          {
            expiresIn: '24h'
          }
        );
        return res.send({
          error: false,
          message: 'Login successfully.',
          data: {
            token: token,
            name: us.name,
          },
        })
      } else {
        return res.status(401).send({
          error: true,
          message: 'Email or password is incorrect.',
        });
      }
    }).catch(err => {
      console.log(err.message);
      res.status(500).send({
        error: true,
        message: "Internal Server Error."
      })
    })
  }).catch(err => {
    console.log(err.message);
    res.status(500).send({
      error: true,
      message: 'Internal Server Error.',
    });
  })
}

function getUsers(req, res) {
  const userId = req.userId;
  User.findById(userId).then(u=>{
    if(!u){
      return res.status(401).send({
        error: true,
        message: 'Invalid token, please try login again.'
      });
    }
    User.find({}, "name").then(us=>{
      return res.send({
        error: false,
        data: us,
      });
    }).catch(err=>{
      console.log(err.message);
      res.status(500).send({
        error: true,
        message: "Internal Server Error."
      })
    })
  }).catch(err=>{
    console.log(err.message);
    res.status(500).send({
      error: true,
      message: "Internal Server Error."
    })
  })
}

module.exports = {
  register,
  login,
  getUsers,
}