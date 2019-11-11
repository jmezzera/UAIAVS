import React from 'react';

import './styles.css';


type ArchiveButtonProps = {onClick: () => void, children: any};

export default (props: ArchiveButtonProps) => {
    return (
        <i 
            className="fas fa-archive fa-2x archive-icon"
        onClick={props.onClick} />
    )
}
