import React, {Component} from 'react';
import './styles.css';

// import WebSocket from 'ws';
// import JSMpeg from 'jsmpeg';

declare global {
    interface Window {
        JSMpeg: any;
    }
}
export default class VideoPlayer extends Component{
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private canvasDimensions = [640, 360];
    private serverUrl = "localhost:8082/";
    constructor(props: any){
        super(props);
        // fetch("http:" + this.serverUrl, {
        //     method: "OPTIONS"
        // } )
    }
    componentDidMount(){
        var mycanvas = document.getElementsByClassName("canvas")[0];
        const url = 'ws://localhost:8082'
        var player = new window.JSMpeg.Player(url, {canvas: mycanvas});
    }
    render(){
        // var url = 'ws://localhost' +":8082/";
        // console.log(JSMpeg)
        return (
            <div className="videoPlayer">
                <canvas className="canvas" ref={this.canvasRef} width={this.canvasDimensions[0]} height={this.canvasDimensions[1]}></canvas>
            </div>
        )    }
}