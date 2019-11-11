const websocket = require('ws');

const streaming_websocket = new websocket.Server({port: 8082, perMessageDeflate: false});

streaming_websocket.connectionCount = 0;

streaming_websocket.on('connection',
	socket => {
		streaming_websocket.connectionCount++;

		socket.on('close',() => 
                streaming_websocket.connectionCount--
		);
	}
);

streaming_websocket.broadcast = data => {
    for (let client of streaming_websocket.clients){
        if (client.readyState === websocket.OPEN)
            client.send(data);  
    }
};

module.exports = streaming_websocket;