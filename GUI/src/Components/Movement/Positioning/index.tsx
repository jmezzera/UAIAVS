import React, { Component } from 'react';
import './styles.css';

import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
import MyJoystick from '../Joystick';
import Movement from '../../../services/Movement';
import MySlider from '../Slider';


type PositioningProps = {
    movement: Movement;
    position: { x: number, y: number, z: number };
}
export default class Positioning extends Component<PositioningProps, {}>{
    private movement: Movement;

    constructor(props: PositioningProps) {
        super(props);
        this.movement = props.movement;
        this.move = this.move.bind(this);
        this.moveZ = this.moveZ.bind(this);
        
    }
    move(event: IJoystickUpdateEvent): void {
        const x = event.x || 0;
        const y = event.y || 0;
        this.movement.moveDelta(Math.floor(x / 10), Math.floor(y / 10), 0, 0.5);
    }

    moveZ(value: number){
        value = 100 - value;
        this.movement.moveToPoint(-10, -10,  value, 0.5);
    }

    render() {
        return (
            <div className="Positioning">
                <div className="joystick-wrapper">
                    <MyJoystick size={150} move={this.move}></MyJoystick>
                </div>
                <div>
                    <MySlider sliderValue={this.props.position.z} handleChange={this.moveZ}></MySlider>
                </div>
                {/* <ReactSlider 
                    className="vertical-slider"
                    //thumbClassName="example-thumb"
                    //trackClassName="example-track"
                    defaultValue={[0, 50, 100]}
                    //ariaLabel={['Lowest thumb', 'Middle thumb', 'Top thumb']}
                    //renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    orientation="vertical"
                    invert
                    pearling
                    minDistance={10}
                /> */}
            </div>
        );
    }
}
