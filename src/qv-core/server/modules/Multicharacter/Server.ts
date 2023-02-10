/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';

alt.on('QVCore::server::OnMultiplayerReady', (player) => {
	const Data = player.GetData();
	alt.emitClient(player, 'QVCore::client::SpawnMultiplayerData', Data);
});
