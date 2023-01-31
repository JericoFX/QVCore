import * as alt from 'alt-server';
import { QVCore } from '../qv-core/server/exports';

alt.on('jerico', (player) => {
    alt.log(QVCore.Player.GetPlayerById(player.id));
});
