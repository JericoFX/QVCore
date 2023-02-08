import * as alt from 'alt-server';
import { QVCore } from '../qs-core/server';

//
// alt.on('playerConnect', (player) => {

// });

(() => {
    alt.log('RUNNING');
    setTimeout(() => {
		// @ts-ignore
        QVCore.Players.SetPlayerData(0,true, {
            firstname: 'Jerico',
            lastname: 'Acosta',
        })
		QVCore.Players.SetPlayerData(1,true, {
			firstname: 'Kelly',
            lastname: 'Santurio',
        });
        setTimeout(() => {
            alt.log(QVCore.Players.GetPlayerData(0));
            setTimeout(() => {
                alt.log(QVCore.Players.GetPlayerData(1));
            }, 1500);
        }, 1500);
    }, 5000);
})();
