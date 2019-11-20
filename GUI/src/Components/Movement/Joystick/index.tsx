import React from 'react'

import './styles.css';

import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent, IJoystickProps} from 'react-joystick-component/build/lib/Joystick';



interface MyJoystickProps extends IJoystickProps{
    movementAlert(): IJoystickUpdateEvent,
    cbThrottling: number
}

export default class MyJoystick extends Joystick{
    private lastEvent: (IJoystickUpdateEvent | null) = null;
    private interval: NodeJS.Timeout | null = null;
    private throttle: number; 

    constructor(props: MyJoystickProps){
        super(props);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.myMove = this.myMove.bind(this);
        this.throttle = this.props.throttle || 500;
    }
    start(){
        if (this.props.move)
                if (this.lastEvent)
                    this.props.move(this.lastEvent as IJoystickUpdateEvent);
        this.interval = setInterval(() => {
            if (this.props.move)
                if (this.lastEvent)
                    this.props.move(this.lastEvent as IJoystickUpdateEvent);
        }, this.throttle);
    }
    stop(){
        this.lastEvent = null;
        if (this.interval)
            clearInterval(this.interval as NodeJS.Timeout);
    }
    myMove(event: IJoystickUpdateEvent){
        this.lastEvent = event;
        if (!this.interval)
            this.start();
    }
    render() {
        return (
            <div className="joystick">
                <Joystick throttle={100} size={this.props.size} start={this.start} stop={this.stop} move={this.myMove}></Joystick>
            </div>
        )
    }
}