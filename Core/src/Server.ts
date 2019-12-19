import * as express from 'express';
import * as socket from 'socket.io';
import * as http from 'http';
import * as CORS from 'cors';
import * as bodyParser from 'body-parser';

import IServer from "./interfaces/IServer";
import StreamingSocket from "./controllers/StreamingSocket";
import Positioning, { FIXED_POINTS } from "./controllers/Positioning";
import Angles from "./controllers/Angles";
import Admin from './controllers/Admin';
import IVideoArchive from './interfaces/IVideoArchive';
import VideoArchive from './controllers/VideoArchive';

export default class Server implements IServer {
    private _app;
    private _server: http.Server;
    private _io: socket.Server;
    private _streamingSocket: StreamingSocket;
    private _positioning: Positioning;
    private _angles: Angles;
    private _admin: Admin;
    private videoArchive: IVideoArchive;
    private automaticMode = false;
    constructor() {
        this.getMode = this.getMode.bind(this);
        this.setMode = this.setMode.bind(this);
        this.app = express();
        this.server = http.createServer();
        this.io = socket(this.server);
        let cors = CORS();
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(bodyParser.json());
        this._app.use(cors);

        this.streamingSocket = new StreamingSocket(8082);

        this.angles = new Angles();

        this.positioning = new Positioning((position: { x: number, y: number, z: number }) => {
            this.io.emit('position', position);
        }, this.getMode);
        
        this._admin = new Admin(this.setMode, this.getMode, this._positioning, this.angles);
        
        this.videoArchive = new VideoArchive(this._streamingSocket);

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

            socket.on('setPoint', (data: { point: string }) => {
                const { x, y, z } = FIXED_POINTS[data.point];
                this.positioning.moveToPoint(x, y, z, 5);
            });

            socket.on('moveTheta', (data: { angle: number }) => {
                this.angles.moveTheta(data.angle);
            });

            socket.on('movePhi', (data: { angle: number }) => {
                this.angles.movePhi(data.angle);

            });

            socket.on('recording', (data: { recording: boolean }) => {
                if (data.recording)
                    this._streamingSocket.startRecording();
                else
                    this._streamingSocket.stopRecording();
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });


        })
    }

    public start() {
        console.info("Starting server")
        this._app.listen(8080);
        this.server.listen(8081);
    }

    public setMode(automatic: boolean): void {
        this.automaticMode = automatic;
    }

    public getMode(): boolean {
        return this.automaticMode;
    }

    /**
     * Getter app
     * @return {Express.Application}
     */
    public get app(): Express.Application {
        return this._app;
    }

    /**
     * Getter server
     * @return {http.Server}
     */
    public get server(): http.Server {
        return this._server;
    }

    /**
     * Getter io
     * @return {socket.Server}
     */
    public get io(): socket.Server {
        return this._io;
    }

    /**
     * Getter streamingSocket
     * @return {StreamingSocket}
     */
    public get streamingSocket(): StreamingSocket {
        return this._streamingSocket;
    }

    /**
     * Getter positioning
     * @return {Positioning}
     */
    public get positioning(): Positioning {
        return this._positioning;
    }

    public get admin(): Admin {
        return this._admin;
    }

    /**
     * Setter app
     * @param {Express.Application} value
     */
    public set app(value: Express.Application) {
        this._app = value;
    }

    /**
     * Setter server
     * @param {http.Server} value
     */
    public set server(value: http.Server) {
        this._server = value;
    }

    /**
     * Setter io
     * @param {socket.Server} value
     */
    public set io(value: socket.Server) {
        this._io = value;
    }

    /**
     * Setter streamingSocket
     * @param {StreamingSocket} value
     */
    public set streamingSocket(value: StreamingSocket) {
        this._streamingSocket = value;
    }

    /**
     * Setter positioning
     * @param {Positioning} value
     */
    public set positioning(value: Positioning) {
        this._positioning = value;
    }

    /**
     * Getter angles
     * @return {Angles}
     */
    public get angles(): Angles {
        return this._angles;
    }


    /**
     * Setter angles
     * @param {Angles} value
     */
    public set angles(value: Angles) {
        this._angles = value;
    }

}