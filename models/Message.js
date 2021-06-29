const mongoose = require("mongoose");
const { modelName } = require("./User");

const Message = mongoose.model('Message', {
  username: String,
  receiver: String,
  text: String,
  timestamp: Number
}, 'messages');

module.exports = Message;