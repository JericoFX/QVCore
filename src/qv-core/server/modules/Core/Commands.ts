/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import * as chat from "chat"

chat.registerCmd("veh", createVehicle)
export function createVehicle(player, vehicleModel) {
	let vehicle;

	try {
		vehicle = new alt.Vehicle(vehicleModel.toString(), player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
	} catch (err) {
		console.error(`${vehicleModel} does not exist.`);
		throw err;
	}

	if (!vehicle) {
		console.error(`${vehicleModel} does not exist.`);
		return;
	}

	console.log('Spawned a vehicle');
	return vehicle;
}