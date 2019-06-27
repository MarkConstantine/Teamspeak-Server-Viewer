'use strict';

class TsServer {
    constructor(virtualServerName, channelList, clientList) {
        this.serverName = virtualServerName;
        
        // Merge the clientList into the channelList.
        for (let channel of channelList) {
            for (let client of clientList) {
                if (client.cid == channel.cid) {
                    channel.addClient(client);
                }
            }
        }

        this.clientList = clientList;
        this.channelList = channelList;
    }

    getClient(clid) {
        for (let client of this.clientList) {
            if (client.clid === clid) {
                return client;
            }
        }

        throw "Could not find client";
    }
}

module.exports = TsServer;