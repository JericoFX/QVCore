/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import * as chat from 'chat';
import Database from '@stuyk/ezmongodb';
import { GetPlayerReady } from './modules/Core/Core';
import { allowDamageEventsForNonNetworkedObjects } from 'natives';
import './modules/Multicharacter/Server';
const url = 'mongodb://localhost:27017';
const dbName = 'jericore';
const collections = ['accounts', 'characters', 'vehicles'];

(async () => {
    alt.log('DATABASE');
    try {
        const connect = await Database.init(url, dbName, collections);
        if (!connect) {
            alt.log('Concha negra');
        }
    } catch (error) {
        alt.logError(error);
    }
    await Database.createSearchIndex('license', 'accounts');
})();
//alt.log('SE LLAMO');
alt.on('playerConnect', async (player) => {
    player.setSyncedMeta('license', 'JERICOFXX');
    player.setSyncedMeta('citizenid', 'HI');
    GetPlayerReady(player);

    player.Login();

    //await Jerico.Login();
    player.spawn(33, 0, 70);
    player.model = 'mp_m_freemode_01';
});

chat.registerCmd('g', (player) => {
    alt.emit('jerico', player);
});

setInterval(async () => {
    alt.Player.all.forEach(async (item) => {
        item.Save();
        alt.log(item.jobName);
    });
}, 10000);
