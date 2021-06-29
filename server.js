const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
const cors = require('cors');

// create a new express application
const app = express();
expressWs(app);

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/automobile", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// decorate the app instance with express-ws to have it
// implement websockets
expressWs(app);

const wsHandler = require('./webSocketHandler');
// add our websocket handler to the '/chat' route
app.ws('/chat/:username/:token', wsHandler);

// host the static files in the build directory
// (we will be using this later)

app.use(express.static('build'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/mappoint', require('./routes/mappoint.route'));
app.use('/api/message', require('./routes/message.route'));

const PORT = 8080;

// start the server, listening to port 8080
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
