"use strict";

class TsServer {
  constructor() {
    this.serverName = "";
    this.channelList = [];
    this.clientList = [];
    this.connectionHistory = [];
  }

  logConnection(connectionInfo, maxConnections) {
    if (this.connectionHistory.length >= maxConnections) {
      this.connectionHistory.shift();
    }
    this.connectionHistory.push(connectionInfo);
  }

  getClient(clid) {
    for (let client of this.clientList) {
      if (client.clid === clid) {
        return client;
      }
    }

    return null;
  }

  getConnectionHistory() {
    return this.connectionHistory;
  }

  update(virtualServerName, channelList, clientList) {
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
    this.clientList = clientList;
  }
}

module.exports = TsServer;
