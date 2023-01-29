import * as alt from 'alt-server';
import { QVCore } from '../qv-core/server';
alt.on('jerico', async (player) => {
    console.log(QVCore.Functions.GetPlayerById(player.id));
});
