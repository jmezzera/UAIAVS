import socketIOClient from 'socket.io-client';


const createSocket = () => {
    const url = "http://localhost:8081";
    return socketIOClient(url);
}

export { createSocket };