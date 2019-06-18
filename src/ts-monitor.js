'use strict';
const TeamspeakQuery = require('teamspeak-query');
const TsClient = require('./ts-client');
const TsChannel = require('./ts-channel');

class TsMonitor {
    constructor(config) {
        this._config = config;
        this._query = new TeamspeakQuery.Raw({ 
            host: this._config.queryAddress,
            port: this._config.queryPort
        });
        this._query.keepalive.enable();
        this._query.keepalive.setDuration(240);

        this._current = [];
    }

    async start(callback) {
        await this._setup();
        await this._update(callback);
        this._query.on('clientmoved', _ => this._update(callback));
        this._query.on('clientleftview', _ => this._update(callback));
        this._query.on('cliententerview', _ => this._update(callback));
        this._query.on('channelcreated', _ => this._update(callback));
        this._query.on('channelmoved', _ => this._update(callback));
    }

    getCurrent() {
        return this._current;
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
            console.log('Setup complete. Now listening...')
        } catch (err) {
            console.error('Could not setup:', err);
        }
    }

    async _update(callback) {
        const channelList = await this._getCurrentChannels();
        const onlineClients = await this._getCurrentOnlineClients();

        for (let channel of channelList) {
            for (let client of onlineClients) {
                if (client.cid == channel.cid) {
                    channel.addClient(client);
                }
            }
        }

        this._current = channelList;

        // Socket callback
        callback();
    }

    async _getCurrentChannels() {
        const currentChannels = [];
    
        try {
            const res = await this._query.send('channellist');
            const channelSpacerRegex = new RegExp("\.\*spacer\.\*");
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
            const serverQueryAdminRegex = new RegExp("\.\*\(s\|S\)erver\.\*");
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