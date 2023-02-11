import * as alt from 'alt-client';
import * as game from 'natives';

alt.onServer('QVCore::client::SpawnMultiplayerData', () => {
    alt.emitServer('QVCore::server::SetPlayerData', 'Q08XSJ');
    // await alt.loadModelAsync(alt.hash('mp_m_freemode_01'));
    // const { x, y, z } = alt.Player.local.pos;
    // alt.log(alt.Player.local.pos);
    // game.createPed(2, alt.hash('mp_m_freemode_01'), x, y, z, 180, false, false);
});
