/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';

setTimeout(() => {
    const Jerico = alt.Player.getByID(0);
    alt.log('El Trabajo es ', Jerico.fullName);
}, 10000);
