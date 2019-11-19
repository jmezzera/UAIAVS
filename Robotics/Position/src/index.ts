import * as http from 'http';
import * as socket from 'socket.io';
import * as express from 'express';
import * as bodyParser from 'body-parser';


import Positioning from './Positioning';
import { Point } from './Space';
import Sequence from './Sequences';

const app = express()
const server = http.createServer(app);
const io = socket(server);

let connectedClient: socket.Socket = null;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const positionChanged = (newPos: Point): void => {
    if (connectedClient) {
        connectedClient.emit('position', newPos);
    }

}

const positioning: Positioning = new Positioning(positionChanged);

// /PATCH /admin/motorsPower
// /POST /admin/setPosition

app.post('/moveToPoint', (req, res) => {
    const { x, y, z } = req.body;
    const time = req.body.time * 1000;

    res.sendStatus(200);

    positioning.moveToPoint(new Point(x, y, z), time);
})

app.post('/moveDelta', (req, res) => {
    const { x, y, z } = req.body;
    const time = req.body.time * 1000;


    positioning.moveDelta(new Point(x, y, z), time)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(400).send(err);
        })
})

app.post('/moveDir', (req, res) => {
    const {x, y, z} = req.body;

    const parsedSpeed = parseInt(req.body.speed);
    const speed = isNaN(parsedSpeed) ? 10 : parsedSpeed;


    const status = positioning.moveDir(new Point(x, y, z), speed);
    
    res.sendStatus(status);
})

app.post('/moveMotor/:motor', (req, res) => {
    const motor = Number(req.params.motor)
    if (!isNaN(motor) && motor < 4 && motor >= 0) {
        let angles: [number, number, number, number] = [0, 0, 0, 0];
        angles[motor] = req.body.angle;
        const { time } = req.body
        positioning.moveMotors(angles, time);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
})

app.post('/sequence', (req, res) => {
    const sequence: string = req.body.sequence;
    const eSequence: Sequence = Sequence[sequence];
    const iterations = req.body.iterations;
    if (!sequence) {
        res.sendStatus(404);
        return;
    }
    positioning.runSequence(eSequence, iterations);
    res.sendStatus(200);

})

app.post('/moveMotors', (req, res) => {
    const angles: [number, number, number, number] = req.body.angles.map(angle => Number(angle));
    const time = Number(req.body.time);
    positioning.moveMotors(angles, time);
    res.sendStatus(200);
})

app.patch('/admin/motorsPower', (req, res) => {
    const power = Number(req.body.power)

    if (power !== 0 && power !== 1) {
        res.sendStatus(400);
    } else {
        positioning.setMotorsPower(power);
        res.sendStatus(200);
    }
})

app.patch('/admin/motorsPower/:motor', (req, res) => {
    const motor = Number(req.params.motor)
    if (!isNaN(motor) && motor < 4 && motor >= 0) {
        const power = Number(req.body.power)
        if (power !== 0 && power !== 1) {
            res.sendStatus(400);
        } else {
            positioning.setMotorsPower(power, motor);
            res.sendStatus(200);
        }
    } else {
        res.sendStatus(400);
    }
})

app.post('/admin/setPosition', (req, res) => {
    const { x, y, z } = req.body;
    positioning.position = new Point(x, y, z);
    res.sendStatus(200);
})

io.on("connection", (socket: socket.Socket) => {
    console.log("Connection received");

    if (connectedClient) {
        socket.emit('connectionAborted', "Client already connected. Maximum one allowed");
        console.log("Aborted connection");
        return;
    }
    console.log("Connection accepted");
    connectedClient = socket;
    socket.emit('connectionAccepted', "Connection accepted");

    socket.on('moveDelta', (delta: { x: number, y: number, z: number, time: number }) => {
        const { x, y, z } = delta;
        const time = delta.time * 1000
        positioning.moveDelta(new Point(x, y, z), time);
    })


    socket.on("disconnect", () => {
        connectedClient = null;
        console.log("Client disconnected");
    })
})

server.listen(8080, () => console.log("API listening on port 8080"));