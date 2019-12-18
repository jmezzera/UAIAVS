import React, { Component } from 'react';

import './styles.css';

import uaiavs from '../../Assets/Images/uaiavsEye.png';
import { field } from './field64';

export default class Canvas extends Component<{ position: { x: number, y: number, z: number } }, {canvasDimensions: [number, number]}> {
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private imgRef = React.createRef<HTMLImageElement>();
    private fieldRef = React.createRef<HTMLImageElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            canvasDimensions: [0,0]
        }
    }

    componentDidMount() {
        let canvas = document.getElementsByClassName('field-canvas')[0];
        this.setState({canvasDimensions: [canvas.clientWidth, canvas.clientHeight]}, this.updateCanvas);
    }

    updateCanvas() {
        const canvas = this.canvasRef.current;
        const img = this.imgRef.current;
        const fieldImg = this.fieldRef.current;
        const { x, y } = this.props.position;
        let canvasX = mapValue(x, 0, 200, 10, this.state.canvasDimensions[0] - 10);
        if (canvasX < 20)
            canvasX = 20;
        if (canvasX > this.state.canvasDimensions[0] - 10)
            canvasX = this.state.canvasDimensions[0] - 20;
        let canvasY = mapValue(y, 0, 150, 10, this.state.canvasDimensions[1] - 10);
        if (canvasY < 20)
            canvasY = 20;
        if (canvasY > this.state.canvasDimensions[1] - 10)
            canvasY = this.state.canvasDimensions[1] - 20;
        canvasY = this.state.canvasDimensions[1] - canvasY;
        if (canvas && img && fieldImg) {
            const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.fillStyle = "#00F000";
            ctx.drawImage(fieldImg, 0,0, this.state.canvasDimensions[0], this.state.canvasDimensions[1]);
            ctx.drawImage(img, canvasX, canvasY, 15, 15);
        }
    }

    render() {
        this.updateCanvas();
        return (

            <div className="screen">
                <div className="canvas-wrapper">
                    <img alt="uaiavs" src={uaiavs} width={10} style={{ display: "none" }} ref={this.imgRef}></img>
                    <img alt="field" src={field} style={{ display: "none" }} ref={this.fieldRef} width={this.state.canvasDimensions[0]} height={this.state.canvasDimensions[1]}></img>
                    <canvas className="field-canvas" ref={this.canvasRef} width={this.state.canvasDimensions[0]} height={this.state.canvasDimensions[1]}></canvas>
                </div>
            </div>
        )
    }
}


const mapValue = (value: number, in_min: number, in_max: number, out_min: number, out_max: number): number => {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}