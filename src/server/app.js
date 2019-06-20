'use strict';
const io = require('socket.io');
const server = io.listen(3000);

const config = require('../config');
const TsViewer = require('./ts-viewer');

const tsViewer = new TsViewer(config);
tsViewer.start();

server.on('connection', socket => {
    console.log('A user connected');

    socket.emit('update', tsViewer.getCurrentServer());

    tsViewer.on('update', currentServer => {
        socket.emit('update', currentServer);
    });

    socket.on('disconnect', _ => {
        console.log('A user disconnected');
    });
});

process.on('SIGINT', _ => {
    console.log('Closing application...');
    tsViewer.stop();
    process.exit();
});