"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socket = require("socket.io");
const http = require("http");
class Server {
    constructor() {
        this.app = express();
        this.server = http.createServer();
        this.io = socket(this.server);
    }
}
// class Server implements{ private app: Express;
// }
// const app = express();
// const server = http.createServer(app);
// const io = socket(server);
// const websocket = require('ws');
// io.on("connection", socket => {
//     console.log("connected");
//     socket.on("disconnect", () => {
//         console.log("disconnected");
//     })
// })
// server.listen(3001, () => {
//     console.log('Server running on port 3001');
// })
//# sourceMappingURL=Servera.js.map