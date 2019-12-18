"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var socket = require("socket.io");
var express = require("express");
var bodyParser = require("body-parser");
var Positioning_1 = require("./Positioning");
var Space_1 = require("./Space");
var Sequences_1 = require("./Sequences");
var app = express();
var server = http.createServer(app);
var io = socket(server);
var connectedClient = null;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var positionChanged = function (newPos) {
    if (connectedClient) {
        connectedClient.emit('position', newPos);
    }
};
var positioning = new Positioning_1.default(positionChanged);
// /PATCH /admin/motorsPower
// /POST /admin/setPosition
app.post('/moveToPoint', function (req, res) {
    var _a = req.body, x = _a.x, y = _a.y, z = _a.z;
    var time = req.body.time * 1000;
    res.sendStatus(200);
    positioning.moveToPoint(new Space_1.Point(x, y, z), time);
});
app.post('/moveDelta', function (req, res) {
    var _a = req.body, x = _a.x, y = _a.y, z = _a.z;
    var time = req.body.time * 1000;
    positioning.moveDelta(new Space_1.Point(x, y, z), time)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
});
app.post('/moveDir', function (req, res) {
    var _a = req.body, x = _a.x, y = _a.y, z = _a.z;
    var parsedSpeed = parseInt(req.body.speed);
    var speed = isNaN(parsedSpeed) ? 10 : parsedSpeed;
    var status = positioning.moveDir(new Space_1.Point(x, y, z), speed);
    res.sendStatus(status);
});
app.post('/moveMotor/:motor', function (req, res) {
    var motor = Number(req.params.motor);
    if (!isNaN(motor) && motor < 4 && motor >= 0) {
        var angles = [0, 0, 0, 0];
        angles[motor] = req.body.angle;
        var time = req.body.time;
        positioning.moveMotors(angles, time);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/sequence', function (req, res) {
    var sequence = req.body.sequence;
    var eSequence = Sequences_1.default[sequence];
    var iterations = req.body.iterations;
    if (!sequence) {
        res.sendStatus(404);
        return;
    }
    positioning.runSequence(eSequence, iterations);
    res.sendStatus(200);
});
app.post('/moveMotors', function (req, res) {
    var angles = req.body.angles.map(function (angle) { return Number(angle); });
    var time = Number(req.body.time);
    positioning.moveMotors(angles, time);
    res.sendStatus(200);
});
app.patch('/admin/motorsPower', function (req, res) {
    var power = Number(req.body.power);
    if (power !== 0 && power !== 1) {
        res.sendStatus(400);
    }
    else {
        positioning.setMotorsPower(power);
        res.sendStatus(200);
    }
});
app.patch('/admin/motorsPower/:motor', function (req, res) {
    var motor = Number(req.params.motor);
    if (!isNaN(motor) && motor < 4 && motor >= 0) {
        var power = Number(req.body.power);
        if (power !== 0 && power !== 1) {
            res.sendStatus(400);
        }
        else {
            positioning.setMotorsPower(power, motor);
            res.sendStatus(200);
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/admin/setPosition', function (req, res) {
    var _a = req.body, x = _a.x, y = _a.y, z = _a.z;
    positioning.position = new Space_1.Point(x, y, z);
    res.sendStatus(200);
});
io.on("connection", function (socket) {
    console.log("Connection received");
    if (connectedClient) {
        socket.emit('connectionAborted', "Client already connected. Maximum one allowed");
        console.log("Aborted connection");
        return;
    }
    console.log("Connection accepted");
    connectedClient = socket;
    socket.emit('connectionAccepted', "Connection accepted");
    socket.on('moveDelta', function (delta) {
        var x = delta.x, y = delta.y, z = delta.z;
        var time = delta.time * 1000;
        positioning.moveDelta(new Space_1.Point(x, y, z), time);
    });
    socket.on("disconnect", function () {
        connectedClient = null;
        console.log("Client disconnected");
    });
});
server.listen(8080, function () { return console.log("API listening on port 8080"); });
//# sourceMappingURL=index.js.map