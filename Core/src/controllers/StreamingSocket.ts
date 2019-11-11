import websocket = require('ws');
import * as fs from 'fs';
export default class StreamingSocket extends websocket.Server {
    private connectionCount = 0;
    private savingStream: fs.WriteStream;

    constructor(port: number) {
        super({ port, perMessageDeflate: false }, null);
        this.on('connection', (socket: any) => {
            this.connectionCount++;

            socket.on('close', () =>
                this.connectionCount--
            );
        }
        );
    }

    broadcast = (data: any) => {
        this.clients.forEach( (client) => {
            if (client.readyState === websocket.OPEN)
                client.send(data);
        })

    }

    startRecording = () => {
        const today = new Date();
        let fileName = today.toLocaleDateString() + ';' + today.toLocaleTimeString();
        fileName = fileName.replace(/:/g, '-');
        const path = __dirname + '/../../static/videos/' + fileName + '.mpg';
        const writableStream = fs.createWriteStream(path, {flags: 'w'});
        writableStream.on('open', () => {
            this.savingStream = writableStream;
        })
    }

    saveToDisk = (data) => {        
        if (this.savingStream)
            this.savingStream.write(data);
    }

    stopRecording = () => {
        this.savingStream.end()
        this.savingStream = null;
    }

    request = (req: any, res: any) => {
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
    }
    
}