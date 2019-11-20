import React, { Component } from 'react';

import './styles.css';
import MyJoystick from '../Joystick';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
import IAngles from '../../../services/IAngles';

type AnglesProps = {
    anglesController: IAngles,
}
export default class Angles extends Component<AnglesProps, {}> {
    constructor(props: any) {
        super(props);
        this.move = this.move.bind(this);
    }
    move(event: IJoystickUpdateEvent): void {
        switch (event.direction) {
            case "FORWARD":
                this.props.anglesController.movePhi(-5);
                break;
            case "BACKWARD":
                this.props.anglesController.movePhi(5);

                break;
            case "RIGHT":
                this.props.anglesController.moveTheta(5)

                break;
            case "LEFT":
                this.props.anglesController.moveTheta(-5)

                break;
        }
    }
    render() {
        return (
            <div className="angleControl">
                <div className="joystick-wrapper">
                    <MyJoystick throttle={500} size={150} move={this.move}></MyJoystick>
                </div>
                {this.props.children}
            </div>
        )
    }
}