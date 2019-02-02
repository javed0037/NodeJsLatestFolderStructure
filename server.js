const express = require('express'),
    bodyParser = require('body-parser'),
    settings = require('./config/settings'),
    cors = require('cors'),
    routes = require('./routes'),
    path = require('path'),
    jwt = require('./routes/middlewares/jwt'),
   // myLogger = require('./routes/middlewares/middleware'),
    errorHandler = require('./utils/errorHandler')
    console.log("there are the working ")
    
var app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'videofolder')));
    //app.use(myLogger);
    app.use(jwt());
    app.use(errorHandler);


let userapi = routes.user;
let task = routes.task;
let transactions = routes.transactions;
let video = routes.video;

app.use("/api/v1", userapi);
app.use("/api/v1", task);
app.use("/api/v1", transactions);
app.use("/api/v1", video);
app.listen(settings.port, function () {
    console.log('server running on port ' + settings.port);
});