const MessageController = require("./controllers/message.controllers");
// Create a new set to hold each clients socket connection
const connections = {};

// We define a handler that will be called everytime a new
// Websocket connection is made
const wsHandler = (ws, req) => {
  // Get username from params of req

  const username = req.params.username;
  const token = req.params.token;
  // Add the connection to our set
  connections[username] = ws;
  console.log(">> Join", username);

  ws.on("message", (message) => {
    const { username, receiver, text } = JSON.parse(message);
    const newMessage = { username, receiver, text, timestamp: Date.now() };
    MessageController.saveMessage(
      { message: newMessage, name: username, token },
      function (err) {
        if (!err) {
          if (connections[username]) {
            connections[username].send(JSON.stringify(newMessage));
          }
          if (connections[receiver]) {
            connections[receiver].send(JSON.stringify(newMessage));
          }
        }
      }
    );
  }).catch((err) => {
    console.log(err.message);
  });

  // Once the client disconnects, the `close` handler is called
  ws.on("close", () => {
    // The closed connection is removed from the set
    console.log(">> Closed", username);
    delete connections[username];
  });
};

module.exports = wsHandler;
