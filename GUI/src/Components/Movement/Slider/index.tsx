import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import './styles.css';

const PrettoSlider = withStyles({
    root: {
      color: '#80ff80',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      //marginTop: -8,
      marginLeft: '-20%',
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      width: 8,
      borderRadius: 10,
    },
    rail: {
      width: 8,
      borderRadius: 10,
    },
  })(Slider);

type SliderProps = {
  handleChange: (value: number) => void,
  sliderValue: number,
};
type SliderState = {
  readyToSend: boolean,

}

export default class MySlider extends Component<SliderProps, SliderState> {

    constructor(props: SliderProps){
        super(props);
        this.state = {
          readyToSend: true,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(_event: any, value: number | number[]): void{
      value = value as number;
      if (this.state.readyToSend){

        this.props.handleChange(value);
        this.setState({
          readyToSend: false,
        })
        setTimeout(() => {
          this.setState({readyToSend: true})
        }, 500);

      }

    }
    
    render(){
        return (
            <div className="slider-wrapper">
                <PrettoSlider value={100 - this.props.sliderValue} valueLabelDisplay="auto" aria-label="pretto slider" orientation="vertical" defaultValue={100} onChange={this.handleChange}/>
            </div>
        )
    }
}