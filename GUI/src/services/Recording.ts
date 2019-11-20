import IRecording from "./IRecording";

export default class Recording implements IRecording{
    private _socket;
    constructor(socket){
        this._socket = socket;
    }
    
    public startRecording(){
        this._socket.emit('recording', {recording: true});
    }
    public stopRecording(){
        this._socket.emit('recording', {recording: false});
    }
}