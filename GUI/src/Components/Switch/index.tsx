import React, { Component } from 'react';
import './styles.css';
import IMode from '../../services/IMode';

type SwitchProps = {
    controller: IMode
};
type SwitchState = {
    checked: boolean,
    backgroundColor: string
}

export default class MySwitch extends Component<SwitchProps, SwitchState> {
    constructor(props: SwitchProps){
        super(props);
        this.state = { checked: false, backgroundColor: "#000000" };
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange() {
        let newState = (this.state.checked) ? false : true;
        let newBg = (this.state.checked) ? "#000000" : "#80ff80";
        this.setState({ checked: newState, backgroundColor: newBg });
        this.props.controller.setMode(newState);
    }
    
    render(){
        return (
            <div className="switch-wrapper">
                <input
                checked={this.state.checked}
                onChange={this.handleChange}
                className="react-switch-checkbox"
                id={'react-switch-new'}
                type="checkbox"
                />
                <label style={{background: this.state.backgroundColor}} className="react-switch-label" htmlFor={'react-switch-new'}>
                    <span className={`react-switch-button`} />
                </label> 
            </div>
        )
    }

}