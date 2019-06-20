'use strict';
const io = require('socket.io');
const server = io.listen(3000);

const config = require('../config');
const TsMonitor = require('./ts-monitor');

const tsMonitor = new TsMonitor(config);
tsMonitor.start();

server.on('connection', socket => {
    console.log('A user connected');

    socket.emit('update', tsMonitor.getCurrentServer());

    tsMonitor.on('update', currentServer => {
        socket.emit('update', currentServer);
    });

    socket.on('disconnect', _ => {
        console.log('A user disconnected');
    });
});

process.on('SIGINT', _ => {
    console.log('Closing application...');
    tsMonitor.stop();
    process.exit();
});