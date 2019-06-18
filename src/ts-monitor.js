'use strict';
const TeamspeakQuery = require('teamspeak-query');
const TsClient = require('./ts-client');
const TsChannel = require('./ts-channel');
const Config = require('./config');

const query = new TeamspeakQuery.Raw({ host: Config.queryAddress, port: Config.queryPort });
query.keepalive.enable();
query.keepalive.setDuration(240);

async function getCurrentChannels() {
    const currentChannels = [];

    try {
        const res = await query.send('channellist');
        const channelSpacerRegex = new RegExp("\.\*spacer\.\*");
        for (let i = 0; i < res.channel_order.length; i++) {
            if (!Config.allowChannelSpacers && channelSpacerRegex.test(res.channel_name[i])) {
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

async function getCurrentOnlineClients() {
    const onlineClients = [];
    
    try {
        const res = await query.send('clientlist');
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

async function update() {
    const channelList = await getCurrentChannels();
    const onlineClients = await getCurrentOnlineClients();

    for (let channel of channelList) {
        for (let client of onlineClients) {
            if (client.cid == channel.cid) {
                channel.addClient(client);
            }
        }
    }

    console.log(channelList);
    console.log(onlineClients);
}

async function setup() {
    try {
        await query.send('login', Config.queryUser, Config.queryPass);
        await query.send('use', { sid: Config.querySID, port: Config.queryVirtualServerPort });
        await query.send('servernotifyregister', { 'event': 'channel', 'id': 0 });
        console.log('Setup complete. Now listening...')
    } catch (err) {
        console.error('Could not setup:', err);
    }
}

function listenForExit() {
    console.log("Press any key to stop the monitor...");
    try {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', async _ => {
            await query.disconnect();
            console.log("Exiting...")
            process.exit(0);
        });
    } catch (err) {
        console.log('Could not listen for exit:', err);
    }
}

async function main() {
    listenForExit();
    await setup();
    await update();

    // TODO: Received twice?
    query.on('clientmoved', _ => update());
    query.on('clientleftview', _ => update());
    query.on('cliententerview', _ => update());

    query.on('channelcreated', _ => update());
    query.on('channelmoved', _ => update());

}

main();