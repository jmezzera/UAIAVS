import React, { Component } from 'react';

import './styles.css';

import updatePower from '../../../services/Power';

type PowerButtonProps = {};
type PowerButtonState = {
    power: number
}


export default class PowerButton extends Component<PowerButtonProps, PowerButtonState> {
    constructor(props: PowerButtonProps){
        super(props);
        this.state = {
            power: 1
        }
    }
    btnClicked(){
        const oldState = this.state.power;
        const newState = oldState ? 0 : 1;
        updatePower(newState);
        this.setState({power: newState});
    }
    render(){
        return (
            <i style={{color: this.state.power ? 'green' : 'red'}} 
                className="fas fa-power-off fa-2x power-icon"
                onClick={() => this.btnClicked()}
            />
        )
    }

}