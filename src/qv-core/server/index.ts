/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import * as chat from 'chat';
import Database from '@stuyk/ezmongodb';
import { GetPlayerReady } from './modules/Core/Core';
////import { QVCore } from './exports';
//import Player from './modules/Player/Player';
//
const url = 'mongodb://localhost:27017';
const dbName = 'jericore';
const collections = ['accounts', 'characters', 'vehicles'];
//
(async () => {
    const connect = await Database.init(url, dbName, collections);
    await Database.createSearchIndex('license', 'accounts');
})();
//alt.log('SE LLAMO');
alt.on('playerConnect', async (player) => {
    player.setSyncedMeta('license', 'JERICOFXX');
    player.setSyncedMeta('citizenid', 'HI');
    GetPlayerReady(player);
    setTimeout(() => {
        player.Login();
    }, 1500);
    //await Jerico.Login();
    player.spawn(33, 0, 70);
    player.model = 'mp_m_freemode_01';
});

chat.registerCmd('g', (player) => {
    alt.emit('jerico', player);
});
