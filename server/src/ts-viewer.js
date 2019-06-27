"use strict";
const TeamspeakQuery = require("teamspeak-query");
const EventEmitter = require("eventemitter2");

const TsClient = require("./ts-client");
const TsChannel = require("./ts-channel");
const TsServer = require("./ts-server");

class TsViewer extends EventEmitter {
  constructor(config) {
    super();

    this._config = config;
    this._query = new TeamspeakQuery.Raw({
      host: this._config.queryAddress,
      port: this._config.queryPort
    });
    this._query.keepalive.enable();
    this._query.keepalive.setDuration(240);

    this._currentServer = null;
  }

  async start() {
    await this._setup();
    await this._update();
    this._query.on("cliententerview", async clientinfo => {
      // The updated server instance does not contain the client.
      // Therefore, must query for it.
      let client = await this._query.send("clientinfo", {clid: clientinfo.clid});
      
      // Restricting what we send over the wire mainly because
      // most of the info the query obtains is not needed.
      this.emit("cliententerview", {
        clid: client.clid,
        client_nickname: client.client_nickname,
        time_connected: new Date(),
      });
      
      this._update();
    });
    this._query.on("clientleftview", clientinfo => {
      let client = this.getCurrentServer().getClient(clientinfo.clid);
      
      this.emit("clientleftview", {
        clid: client.clid,
        client_nickname: client.client_nickname,
        time_disconnected: new Date(),
      });
      
      this._update();
    });
    this._query.on("clientmoved", _ => this._update());
    this._query.on("channelcreated", _ => this._update());
    this._query.on("channeledited", _ => this._update());
    this._query.on("channelmoved", _ => this._update());
    this._query.on("serveredited", _ => this._update());
  }

  getCurrentServer() {
    return this._currentServer;
  }

  async stop() {
    await this._query.disconnect();
  }

  async _setup() {
    try {
      await this._query.send(
        "login",
        this._config.queryUser,
        this._config.queryPass
      );
      await this._query.send("use", {
        sid: this._config.querySID,
        port: this._config.queryVirtualServerPort
      });
      await this._query.send("servernotifyregister", {
        event: "channel",
        id: 0
      });
      await this._query.send("servernotifyregister", {
        event: "server",
        id: 0
      });
      console.log(
        `TsViewer setup complete. ` +
          `Now listening for incoming TS connections on ` +
          `port ${this._config.queryVirtualServerPort}...`
      );
    } catch (err) {
      console.error("Could not setup:", err);
    }
  }

  async _update() {
    Promise.all([
      this._query.send("serverlist"),
      this._getCurrentChannels(),
      this._getCurrentOnlineClients()
    ]).then(values => {
      this._currentServer = new TsServer(
        values[0].virtualserver_name,
        values[1],
        values[2]
      );
      this.emit("update", this.getCurrentServer());
    });
  }

  async _getCurrentChannels() {
    const currentChannels = [];

    try {
      const res = await this._query.send("channellist");
      const channelSpacerRegex = new RegExp(".*spacer.*");
      for (let i = 0; i < res.channel_order.length; i++) {
        if (
          !this._config.allowChannelSpacers &&
          channelSpacerRegex.test(res.channel_name[i])
        ) {
          continue;
        }

        currentChannels.push(new TsChannel(res.cid[i], res.channel_name[i]));
      }
    } catch (err) {
      console.error("Could not get channellist:", err);
    }

    return currentChannels;
  }

  async _getCurrentOnlineClients() {
    const onlineClients = [];

    try {
      const res = await this._query.send("clientlist");
      const serverQueryAdminRegex = new RegExp(".*(s|S)erver.*");
      for (let i = 0; i < res.clid.length; i++) {
        if (
          !this._config.displayServerQueryUsers &&
          serverQueryAdminRegex.test(res.client_nickname[i])
        ) {
          continue;
        }
        onlineClients.push(
          new TsClient(res.clid[i], res.client_nickname[i], res.cid[i])
        );
      }
    } catch (err) {
      console.error("Could not get clientlist:", err);
    }

    return onlineClients;
  }
}

module.exports = TsViewer;
