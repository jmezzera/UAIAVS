"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket = require("ws");
const fs = require("fs");
class StreamingSocket extends websocket.Server {
    constructor(port) {
        super({ port, perMessageDeflate: false }, null);
        this.connectionCount = 0;
        this.broadcast = (data) => {
            this.clients.forEach((client) => {
                if (client.readyState === websocket.OPEN)
                    client.send(data);
            });
        };
        this.startRecording = () => {
            const today = new Date();
            let fileName = today.toLocaleDateString() + ';' + today.toLocaleTimeString();
            fileName = fileName.replace(/:/g, '-');
            const path = __dirname + '/../../static/videos/' + fileName + '.mpg';
            const writableStream = fs.createWriteStream(path, { flags: 'w' });
            writableStream.on('open', () => {
                this.savingStream = writableStream;
            });
        };
        this.saveToDisk = (data) => {
            if (this.savingStream)
                this.savingStream.write(data);
        };
        this.stopRecording = () => {
            // this.savingStream.end()
            // this.savingStream = null;
        };
        this.request = (req, res) => {
            console.log("Getting stream");
            res.connection.setTimeout(0);
            req.on('data', (data) => {
                this.broadcast(data);
                this.saveToDisk(data);
            });
            req.on('end', () => {
                if (req.socket.recording)
                    req.socket.recording.close();
                this.stopRecording();
            });
        };
        this.on('connection', (socket) => {
            this.connectionCount++;
            socket.on('close', () => this.connectionCount--);
        });
    }
}
exports.default = StreamingSocket;
//# sourceMappingURL=StreamingSocket.js.map