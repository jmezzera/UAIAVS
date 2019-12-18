import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import './styles.css'

import SwapHoriz from '@material-ui/icons/SwapHoriz';
import SwapVert from '@material-ui/icons/SwapVert';
import Round from '@material-ui/icons/RotateLeft';

import CenterTop from '@material-ui/icons/CenterFocusStrong';
import CenterCenter from '@material-ui/icons/CenterFocusWeak';
import Right from '@material-ui/icons/ArrowRight';
import Left from '@material-ui/icons/ArrowLeft';

import { SetPoint } from '../../Types/SetPoints';
import { Sequence } from '../../Types/Sequences';
import Movement from '../../services/Movement';

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));



export default function FloatingActionButtons(props: { setPoints: SetPoint[], sequences: Sequence[], movement: Movement}) {
    const classes = useStyles();
    const chooseSequenceIcon = (icon: Sequence ) => {
        switch (icon){
            case Sequence.Middle_Length:
                return (
                    <SwapHoriz />
                );
            case Sequence.Middle_Width:
                return (
                    <SwapVert />
                );
            case Sequence.Round:
                return (
                    <Round />
                );
            default:
                return (
                    <AddIcon />
                )
        }
    }
    const choosePointIcon = (icon : SetPoint) => {
        switch (icon) {
            case SetPoint.CENTER_TOP:
                return (
                    <CenterTop />
                );
            case SetPoint.CENTER_CENTER:
                return (
                    <CenterCenter />
                );
            case SetPoint.LEFT_GOAL:
                return (
                    <Left />
                );
            case SetPoint.RIGHT_GOAL:
                return (
                    <Right />
                );
        }
    }
    return (
        <div className="botonera">
            <div className="setPoints">
                {props.setPoints.map( (setPoint, index) => {
                    return (
                        <Fab key={"sP" + index} aria-label="add" className={"boton " + classes.fab}
                            onClick={() => props.movement.moveToSetPoint(setPoint)}>
                            {choosePointIcon(setPoint)}
                        </Fab>
                    )
                })}
            </div>
            <div className="sequences">
                {props.sequences.map((sequence, index) => {
                    return (
                        <Fab key={"seq" + index} aria-label="add" className={"boton " + classes.fab} 
                            onClick={() => props.movement.runSequence(sequence)}>
                            {chooseSequenceIcon(sequence)}
                        </Fab>   
                    )
                })}
            </div>
        </div>
    );
}