'use strict';

class TsChannel {
    constructor(cid, channel_name) {
        this.cid = cid;
        this.channel_name = channel_name;
        
        this.connected_clients = [];
    }

    addClient(client) {
        this.connected_clients.push(client);
    }
}

module.exports = TsChannel;