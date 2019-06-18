const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('a user connected');

    /* General Idea
        try {
            tsMonitor.start(_ => {
                io.emit('update', tsMonitor.getCurrent());
            });
        } catch (err) {

        }
    */

    socket.on('disconnect', _ => {
        console.log('a user disconnected');
    });
});

http.listen(port, _ => {
    console.log(`listening on *:${port}`);
})