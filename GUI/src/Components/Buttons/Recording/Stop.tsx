import React from 'react';

type StopButtonProps = {
    onClick: () => void,
    visible: boolean
}
export const StopButton = (props: StopButtonProps) => {
    if (!props.visible)
        return null
    return (
        <i className="far fa-stop-circle fa-2x" onClick={props.onClick}></i>
    )
}