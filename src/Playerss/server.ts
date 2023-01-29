import * as alt from 'alt-server';
import { QVCore } from '../qv-core/server';
alt.on('jerico', async (player) => {
    const Data = player.getSyncedMeta('metadata');
    console.log(Data);
    Data.metadata.bloodtype = 'ENTYY';
    //----Update Value
    player.setSyncedMeta('metadata', Data);
    const updated = player.getSyncedMeta('metadata');
    console.log(updated);

    // console.log(QVCore.Functions.GetPlayerById(player.id));
});
