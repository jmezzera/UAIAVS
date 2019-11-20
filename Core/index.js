const streaming_websocket = require('./videoStreaming');

const app = require('express')();

app.use(require('cors')());


app.use('/mystream', (req, res) => {
  console.log("Getting stream");
  res.connection.setTimeout(0);
  req.on('data', streaming_websocket.broadcast);
  req.on('end', () => {
    if (req.socket.recording)
      req.socket.recording.close();
  });
});

app.listen(8080)