import * as alt from 'alt-server';
import { QVCore } from '../qv-core/server/exports';

alt.on('jerico', (player) => {
    QVCore.Player.GetItemByID(player.id);
});
