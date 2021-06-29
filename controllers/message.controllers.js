const User = require("../models/User");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

const PRIVATE_KEY = "JSONWEBTOKEN_PRIVATE_KEY";
function saveMessage({ message, name, token }, callback) {
  jwt.verify(token, PRIVATE_KEY, function (err, decoded) {
    if (!err) {
      const userId = decoded.userId;
      User.findById(userId)
        .then(async (u) => {
          if (!u) {
            callback(true);
          }
          if (u.name !== name) {
            callback(true);
          }
          const newMessage = new Message(message);
          await newMessage.save();
          callback(false);
        })
        .catch((err) => {
          console.log(err.message);
          callback(true);
        });
    } else {
      callback(true);
    }
  });
}

function getMessages(req, res) {
  User.findById(req.userId)
    .then((u) => {
      if (!u) {
        return res.status(404).send({
          error: true,
          message: "Cannot find the user.",
        });
      }
      Message.find({ $or: [{ username: u.name }, { receiver: u.name }] })
        .then((messages) => {
          return res.json({
            error: false,
            data: messages
          });
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500).send({
            error: true,
            message: "Internal Server Error.",
          });
        });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        error: true,
        message: "Internal Server Error.",
      });
    });
}

module.exports = {
  saveMessage,
  getMessages,
};
