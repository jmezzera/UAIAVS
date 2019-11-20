"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const CORS = require("cors");
const bodyParser = require("body-parser");
const StreamingSocket_1 = require("./controllers/StreamingSocket");
const Positioning_1 = require("./controllers/Positioning");
const Angles_1 = require("./controllers/Angles");
const Admin_1 = require("./controllers/Admin");
const VideoArchive_1 = require("./controllers/VideoArchive");
class Server {
    constructor() {
        this.automaticMode = false;
        this.app = express();
        this.server = http.createServer();
        this.io = socket(this.server);
        let cors = CORS();
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(bodyParser.json());
        this._app.use(cors);
        this.streamingSocket = new StreamingSocket_1.default(8082);
        this.angles = new Angles_1.default();
        this._admin = new Admin_1.default(this.setMode);
        this.positioning = new Positioning_1.default((position) => {
            this.io.emit('position', position);
        }, this.getMode);
        this.videoArchive = new VideoArchive_1.default(this._streamingSocket);
        this._app.use('/myStream', this.streamingSocket.request);
        this._app.use('/position', this.positioning.router);
        this._app.use('/videos', this.videoArchive.router);
        this._app.use('/admin', this.admin.router);
        this.io.on("connection", socket => {
            console.log("Client connected");
            socket.on('moveDelta', data => {
                const { x, y, z, time } = data;
                this.positioning.moveDelta(x, y, z, time);
            });
            socket.on('moveToPoint', data => {
                const { x, y, z, time } = data;
                this.positioning.moveToPoint(x, y, z, time);
            });
            socket.on('setPoint', (data) => {
                const { x, y, z } = Positioning_1.FIXED_POINTS[data.point];
                this.positioning.moveToPoint(x, y, z, 5);
            });
            socket.on('moveTheta', (data) => {
                this.angles.moveTheta(data.angle);
            });
            socket.on('movePhi', (data) => {
                this.angles.movePhi(data.angle);
            });
            socket.on('recording', (data) => {
                if (data.recording)
                    this._streamingSocket.startRecording();
                else
                    this._streamingSocket.stopRecording();
            });
            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
    }
    start() {
        console.info("Starting server");
        this._app.listen(8080);
        this.server.listen(8081);
    }
    setMode(automatic) {
        this.automaticMode = automatic;
    }
    getMode() {
        return this.automaticMode;
    }
    /**
     * Getter app
     * @return {Express.Application}
     */
    get app() {
        return this._app;
    }
    /**
     * Getter server
     * @return {http.Server}
     */
    get server() {
        return this._server;
    }
    /**
     * Getter io
     * @return {socket.Server}
     */
    get io() {
        return this._io;
    }
    /**
     * Getter streamingSocket
     * @return {StreamingSocket}
     */
    get streamingSocket() {
        return this._streamingSocket;
    }
    /**
     * Getter positioning
     * @return {Positioning}
     */
    get positioning() {
        return this._positioning;
    }
    get admin() {
        return this._admin;
    }
    /**
     * Setter app
     * @param {Express.Application} value
     */
    set app(value) {
        this._app = value;
    }
    /**
     * Setter server
     * @param {http.Server} value
     */
    set server(value) {
        this._server = value;
    }
    /**
     * Setter io
     * @param {socket.Server} value
     */
    set io(value) {
        this._io = value;
    }
    /**
     * Setter streamingSocket
     * @param {StreamingSocket} value
     */
    set streamingSocket(value) {
        this._streamingSocket = value;
    }
    /**
     * Setter positioning
     * @param {Positioning} value
     */
    set positioning(value) {
        this._positioning = value;
    }
    /**
     * Getter angles
     * @return {Angles}
     */
    get angles() {
        return this._angles;
    }
    /**
     * Setter angles
     * @param {Angles} value
     */
    set angles(value) {
        this._angles = value;
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map