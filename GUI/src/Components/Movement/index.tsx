import React, { Component } from 'react';

import './styles.css';

import Movement from '../../services/Movement';

import Angles from './Angles';
import Positioning from './Positioning';
import IAngles from '../../services/IAngles';

type MovementProps = {
    position: {x: number, y: number, z: number},
    angles: {theta: number, phi: number},
    movement: Movement,
    anglesController: IAngles
}

export default class MovementController extends Component<MovementProps, {}> {
    render(){
        return (
            <div className="movement-controller"> 
                <Positioning position={this.props.position} movement={this.props.movement}></Positioning>
                <Angles anglesController={this.props.anglesController}></Angles>
            </div>
        )
    }
}