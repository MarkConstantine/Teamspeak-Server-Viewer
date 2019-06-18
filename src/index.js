'use strict';
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

const config = require('./config');
const TsMonitor = require('./ts-monitor');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('A user connected');

    try {
        const tsMonitor = new TsMonitor(config);
        tsMonitor.start(_ => {
            io.emit('update', tsMonitor.getCurrent());
        });
    } catch (err) {
        console.error("Could not start TsMonitor:", err);
    }

    socket.on('disconnect', _ => {
        console.log('A user disconnected');
        // TODO: disconnect TS-socket
    });
});

http.listen(port, _ => {
    console.log(`listening on *:${port}`);
})