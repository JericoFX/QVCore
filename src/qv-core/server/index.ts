/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import * as chat from 'chat';
import Database from '@stuyk/ezmongodb';
import {QVCore} from "./exports";

const url = 'mongodb://localhost:27017';
const dbName = 'jericore';
const collections = ['accounts', 'characters', 'vehicles'];

(async () => {
    const connect = await Database.init(url, dbName, collections);
    await Database.createSearchIndex('license', 'accounts');
})();

alt.on('playerConnect', (player) => {
    alt.log('SE LLAMO');
    player.setSyncedMeta('license', 'JERICOFXX');
    QVCore.Player.Login(player, 'JERICOFXX');
    player.spawn(0, 0, 0 + 70);
    player.model = 'mp_m_freemode_01';
});

chat.registerCmd('g', (player, args) => {
    // alt.log(player);
    // const Players = new Player(player.id);
    // alt.log(Players.getPlayerObject(player.id));
    // Players.setMetadata('inJail', false);
    // setTimeout(() => {
    //     alt.log(Players.getPlayerObject(player.id));
    // }, 1000);
    alt.emit('jerico', player);
});
alt.on('playerDisconnect', (player) => {
    // QVCore.Player.Save(player.id);
});
