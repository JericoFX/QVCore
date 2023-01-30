import * as alt from 'alt-server';
import { QVCore } from '../qv-core/server';
alt.on('jerico', async (player) => {
    QVCore.Functions.SetJob(player.id, 'police', 3);
});
