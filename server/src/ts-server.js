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

        this.channelList = channelList;
    }
}

module.exports = TsServer;