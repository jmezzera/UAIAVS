import React, { Component } from 'react';
type RecordingButtonState = {
    color: string
}
type RecordingButtonProps = {
    recording: boolean,
    onClick: () => void
}
export default class RecordingButton extends Component<RecordingButtonProps, RecordingButtonState> {
    private interval: any;
    constructor(props: RecordingButtonProps){
        super(props);
        this.state = {
            color: 'red'
        }
    }
    componentDidMount(){
        this.interval = setInterval(() => {
            this.setState({color: this.state.color === 'red' ? 'gray' : 'red'});
        }, 1000)
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    render() {
        return (
            <i className="fas fa-circle fa-2x" 
                style={{color: this.props.recording ? this.state.color : 'red'}}
                onClick={this.props.onClick}
            ></i>
        )
    }

}