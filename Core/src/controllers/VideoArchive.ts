import * as fs from 'fs'

import IVideoArchive from '../interfaces/IVideoArchive'
import { dirname } from 'path';
import { Router } from 'express';
import StreamingSocket from './StreamingSocket';
import * as childProcess from 'child_process';


export default class VideoArchive implements IVideoArchive {
    private _router: Router;
    private _socket: StreamingSocket;
    private _recordingProcess: childProcess.ChildProcessWithoutNullStreams;
    constructor(socket: StreamingSocket) {
        this._router = Router();
        this._router.get('/', (req, res) => {
            this.listVideos()
                .then(videos => res.status(200).send(videos))
                .catch(err => res.status(500).send(err))
        });

        this._router.get('/:video', (req, res) => {
            const video = req.params.video;
            console.log("getting video", video)
            const path = __dirname + '/../../static/videos/' + video;
                const stat = fs.statSync(path)
                const fileSize = stat.size
                const range = req.headers.range

                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-")
                    const start = parseInt(parts[0], 10)
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize - 1

                    const chunksize = (end - start) + 1
                    const file = fs.createReadStream(path, { start, end })
                    const head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4',
                    }

                    res.writeHead(206, head)
                    file.pipe(res)
                } else {
                    const head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    }
                    res.writeHead(200, head)
                    fs.createReadStream(path, {highWaterMark: 10}).pipe(res)
                }
            })
            // this.playVideo(video);
            // res.sendStatus(200);
        // })
        this._router.delete('/:video', (req, res) => {
            const video = req.params.video;
            this.deleteVideo(video)
                .then(code => res.sendStatus(code))
                .catch(err => {
                    if (err.code === "ENOENT")
                        res.sendStatus(404);
                    else
                        res.status(500).send(err)
                })
        });
        //this._recordingProcess = childProcess.spawn('ffmpeg', ["-i", "udp://192.168.1.108:10001", "/home/juan/UAIAVS/core/static/videos/PRUEBAAAA"]);

        this._socket = socket;
    }
    listVideos(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(__dirname + '/../../static/videos', (err, files) => {
                if (err)
                    reject(err)
                else
                    resolve(files)
            })
        })
    }
    playVideo(video: string): void {
        const path = __dirname + '/../../static/videos/' + video;
        let timeInterval = 100

        let Bps = 84375

        fs.open(path, 'r', (err, fd) =>  {
            fs.fstat(fd, (err, stats) => {
                var filesize = stats.size,
                    chunkSize = Bps / (1000 / timeInterval),
                    buffer = new Buffer(chunkSize),
                    bytesRead = 0;
                console.log(filesize);
                let count = 0
                let interval = setInterval(() => {
                    fs.read(fd, buffer, 0, chunkSize, bytesRead, (err, n, data) => {
                        this._socket.broadcast(data)
                        bytesRead += chunkSize;
                        if ((bytesRead + chunkSize) > filesize) {
                            chunkSize = (filesize - bytesRead);
                        }
                        if (bytesRead >= filesize) {
                            clearInterval(interval);
                            fs.close(fd, () => {});
                        }
                    });
                }, timeInterval)

            });
        });
        // const stream = fs.createReadStream(path, {highWaterMark: 45});
        //stream.on('data', this._socket.broadcast);

    }
    deleteVideo(video: string): Promise<number> {
        const path = __dirname + '/../../static/videos/' + video;
        return new Promise((resolve, reject) => {
            fs.unlink(path, err => {
                if (err)
                    reject(err)
                else
                    resolve(204)
            })

        })
    }

    public get router(): Router {
        return this._router;
    }
    
    public startRecording() {
        let d = new Date();
        let fileName = `Recording${d.getHours()}${d.getSeconds()}.mp4`
        console.log(fileName)
        this._recordingProcess = childProcess.spawn('ffmpeg', ["-i", "udp://192.168.1.108:10001", "/Users/adolfoscalabrini/Desktop/UM/TESIS/UAIAVS/Core/static/videos/" + fileName]);
        //this._recordingProcess.stdout.on('data', data => console.log(data.toString()))
        //this._recordingProcess.stderr.on('data', data => console.log(data.toString()))
        //this._recordingProcess.stdin.write('start\n', 'utf-8');
    }

    public stopRecording() {
        this._recordingProcess.kill();
    }

}