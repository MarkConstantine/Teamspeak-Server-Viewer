'use strict';
const TeamspeakQuery = require('teamspeak-query');
const EventEmitter = require('eventemitter2');

const TsClient = require('./ts-client');
const TsChannel = require('./ts-channel');

class TsMonitor extends EventEmitter {
    constructor(config) {
        super();

        this._config = config;
        this._query = new TeamspeakQuery.Raw({ 
            host: this._config.queryAddress,
            port: this._config.queryPort
        });
        this._query.keepalive.enable();
        this._query.keepalive.setDuration(240);

        this._channelAndClientsList = [];
    }

    async start() {
        await this._setup();
        await this._update();
        this._query.on('clientmoved'    , _ => this._update());
        this._query.on('clientleftview' , _ => this._update());
        this._query.on('cliententerview', _ => this._update());
        this._query.on('channelcreated' , _ => this._update());
        this._query.on('channelmoved'   , _ => this._update());
    }

    getChannelsAndClientsList() {
        return this._channelAndClientsList;
    }

    async stop() {
        await this._query.disconnect();
    }

    async _setup() {
        try {
            await this._query.send('login', this._config.queryUser, this._config.queryPass);
            await this._query.send('use', {
                sid: this._config.querySID, 
                port: this._config.queryVirtualServerPort
            });
            await this._query.send('servernotifyregister', {
                'event': 'channel',
                'id': 0 
            });
            console.log('TsMonitor setup complete. Now listening...')
        } catch (err) {
            console.error('Could not setup:', err);
        }
    }

    async _update() {
        const channelList = await this._getCurrentChannels();
        const onlineClients = await this._getCurrentOnlineClients();

        // Merge the clientlist into the channellist.
        for (let channel of channelList) {
            for (let client of onlineClients) {
                if (client.cid == channel.cid) {
                    channel.addClient(client);
                }
            }
        }

        this._channelAndClientsList = channelList;
        this.emit('update', channelList);
    }

    async _getCurrentChannels() {
        const currentChannels = [];
    
        try {
            const res = await this._query.send('channellist');
            const channelSpacerRegex = new RegExp('\.\*spacer\.\*');
            for (let i = 0; i < res.channel_order.length; i++) {
                if (!this._config.allowChannelSpacers && channelSpacerRegex.test(res.channel_name[i])) {
                    continue;
                }
                currentChannels.push(
                    new TsChannel(res.cid[i], res.channel_name[i]));
            }
        } catch (err) {
            console.error('Could not get channellist:', err);
        }
    
        return currentChannels;
    }

    async _getCurrentOnlineClients() {
        const onlineClients = [];
        
        try {
            const res = await this._query.send('clientlist');
            const serverQueryAdminRegex = new RegExp('\.\*\(s\|S\)erver\.\*');
            for (let i = 0; i < res.clid.length; i++) {
                if (serverQueryAdminRegex.test(res.client_nickname[i])) {
                    continue;
                }
                onlineClients.push(
                    new TsClient(res.clid[i], res.client_nickname[i], res.cid[i]));
            }
        } catch (err) {
            console.error('Could not get clientlist:', err);
        }
    
        return onlineClients;
    }
}

module.exports = TsMonitor;