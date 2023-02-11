/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import * as chat from 'chat';
import Database from '@stuyk/ezmongodb';
import { GetPlayerReady } from './modules/Core/Core';
import './modules/Multicharacter/Server';
import './modules/Core/Commands';
const url = 'mongodb://localhost:27017';
const dbName = 'jericore';
const collections = ['accounts', 'characters', 'vehicles', 'player_skin'];

(async () => {
    try {
        const connect = await Database.init(url, dbName, collections);
        await Database.createSearchIndex('license', 'accounts');
        if (!connect) {
            alt.log('Error connecting the Database');
        }
    } catch (error) {
        alt.logError(error);
    }
})();
//alt.log('SE LLAMO');
alt.on('playerConnect', async (player) => {
    //This fired to the multiplayer.
    try {
        await GetPlayerReady(player);
    } catch (error) {
        alt.logError(error);
    }
    alt.emit('QVCore::server::OnMultiplayerReady', player);
    // try {
    //     await GetPlayerReady(player);
    // } catch (error) {
    //     alt.logError(error);
    // }

    // await player.Login('Q08XSJ');
    // player.model = 'mp_m_freemode_01';
    // alt.emit('Wachin', player);
});

alt.onClient('QVCore::server::SetPlayerData', async (loginInfo: string) => {
    await player.Login(loginInfo.toString());
});
//setInterval(async () => {
//    alt.Player.all.forEach(async (item) => {
//        item.Save();
//        alt.log(item.jobName);
//    });
//}, 10000);
