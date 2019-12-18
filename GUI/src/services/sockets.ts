import socketIOClient from 'socket.io-client';

import config from '../config';


const createSocket = () => {
    return socketIOClient(config.serverSocket);
}

export { createSocket };