'use strict';
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

const config = require('./config');
const TsMonitor = require('./ts-monitor');

const tsMonitor = new TsMonitor(config);
tsMonitor.start();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('A user connected');

    socket.emit('update', tsMonitor.getChannelsAndClientsList());

    tsMonitor.on('update', channelsAndClientsList => {
        socket.emit('update', channelsAndClientsList);
    });

    socket.on('disconnect', _ => {
        console.log('A user disconnected');
    });
});

http.listen(port, _ => {
    console.log(`Listening on ${config.queryAddress}:${port}`);
})

process.on('SIGINT', _ => {
    console.log('Closing application...');
    tsMonitor.stop();
    console.log('Goodbye');
    process.exit();
});