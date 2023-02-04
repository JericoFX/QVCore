/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
//import * as chat from 'chat';
import ShortUniqueId from 'short-unique-id';
import Database from '@stuyk/ezmongodb';
import { Jobs } from '../../../shared/jobs';
import { Config } from '../../../shared/config';

declare module 'alt-server' {
	interface Player {
		citizenid: string;
		license: string;
		money: Object;
		charinfo: Object;
		metadata: Object;
		job: Object;
		gang: Object;
		position: Object;
	}
}

let Players = new Map();
function GenerateCitizenID() {
	const uid = new ShortUniqueId({
		dictionary: 'alphanum_upper',
		length: 6,
	});
	return uid();
}

function ReturnDefaultData(newData) {
	return {
		license: 'JERICOFXX',
		citizenid: GenerateCitizenID(),
		money: {...Config.money},
		charinfo: {
			firstname: newData.firstname || 'TEST',
			lastname: newData.lastname || 'ANOTHER TEST',
			birthdate: newData.birthdate || '23-05-199',
			gender: newData.gender || 1,
			backstory: newData.backstory || '',
			nationality: newData.nationality || 'URU',
		},
		metadata: {
			hunger: 100,
			thirst: 100,
			stress: 0,
			isDead: false,
			inlaststand: false,
			armor: 0,
			isHandcuffed: false,
			tracker: false,
			inJail: false,
			jailItems: [],
			status: {},
			phone: {},
			fitbit: {},
			commandbinds: {},
			bloodtype: {},
			dealerrep: 0,
			craftingrep: 0,
			attachmentcraftingrep: 0,
			currentapartment: null,
			jobRep: {
				tow: 0,
				trucker: 0,
				taxi: 0,
				hotdog: 0,
			},
			callSign: 'NO CALLSIGN',
			licences: {
				driver: true,
				business: false,
				weapon: false,
			},
			inside: {
				house: null,
				apartment: {
					apartmentType: null,
					apartmentId: null,
				},
			},
		},
		job: {
			label: 'Civilian',
			type: 'none',
			isBoss: false,
			onDuty: false,
			grade: {
				name: 'Freelancer',
				level: 0,
				payment: 10,
				isboss: true,
			},
		},
		gang: {
			name: 'none',
			level: 0,
			isBoss: false,
		},
	};
}

// const Information = {

// };

export function GetPlayerReady(player) {
	alt.log('HIIII');
	if (!player && !player.valid) {
		alt.logError(`[CORE] Player not valid`);
		return;
	}
	player.license = 'JERICOFXX';
	/**
	 * Check if the protoype already exist, so dont override it
	 */
	if (typeof alt.Player.prototype.citizenid !== 'string' && typeof alt.Player.prototype.money !== 'object' && typeof alt.Player.prototype.charinfo !== 'object' && typeof alt.Player.prototype.metadata !== 'object' && typeof alt.Player.prototype.job !== 'object' && typeof alt.Player.prototype.gang !== 'object') {
		alt.Player.prototype.citizenid = '';
		alt.Player.prototype.money = {};
		alt.Player.prototype.charinfo = {};
		alt.Player.prototype.metadata = {};
		alt.Player.prototype.job = {};
		alt.Player.prototype.gang = {};
		ExtendPrototype(player);
	}

	player.Login = async (citizenid?: string | boolean, newData) => {
		if (!player && !player.valid) {
			alt.logError(`[CORE] Player not valid`);
			return;
		}
		if (citizenid) {
			const exist = await Database.fetchData('citizenid', citizenid.toString(), 'accounts');
			if (exist === undefined) {
				alt.logError(`[CORE] No player with the CitizenID: ${citizenid} Detected`);
				return;
			}
			alt.log(`[CORE] ~g~Loaded ${citizenid}~g~`);
			return player.SetData(false, exist);
		}
		alt.log(`[CORE] ~y~No data Detected~y~ \n ~g~Creating Player~g~`);
		return player.SetData(true, ReturnDefaultData(newData));
	};

	player.SetData = async (newPayer, newData) => {
		if (!player && !player.valid) {
			alt.logError(`[CORE] Player not valid`);
		}
		if (newPayer) {
			if (newData.firstname !== '') {
				newData.job = Jobs['unemployed'];
				player.setSyncedMeta('charinfo', {...newData});
				player.spawn(0, 0, 70);
			}
		}
		for (const [key, value] of Object.entries(newData)) {
			player.setSyncedMeta(key, newData[key]);
			player[key] = newData[key];
		}

		Players.set(player.id, newData);
		return player.Save();
	};

	/**
	 * Return all the players with a license.
	 * @returns Array | Object
	 * @param license
	 */
	player.GetCharacters = async (license: string): Promise<Object | void | boolean> => {
		try {
			const players = await Database.fetchAllByField('license', license, 'accounts');
			// if (players[0] === undefined) {
			// 	return {};
			// }
			return players || {};
		} catch (error) {
			alt.logError(error);
		}
	};

	player.GetData = () => {
		return Players.get(player.id);
	};

	player.Save = async () => {
		let Data = player.GetData();
		    const exist = await Database.fetchWithSearch(Data.license, 'accounts');
		    Data.pos = player.pos;
		    if (exist.length > 0) {
		        await Database.updatePartialData(exist[0]._id, { ...Data }, 'accounts');
		        alt.log(`[CORE] ~g~Player ${player.fullName} Saved~g~`);
		    } else {
		        const Jerico = await Database.insertData(Data, 'accounts', false);
		    }
		};
	};

	function ExtendPrototype(player) {
		Object.defineProperty(alt.Player.prototype, 'jobName', {
			/**
			 * Get the current job, so no more QVCore.Functions.GetPlayer(player.id)
			 * Now is just player.jobName
			 * @returns
			 */

			get: () => {
				return player.job.label;
			},

			/**
			 * The same way now you can set the job with:
			 * player.jobName = "police"
			 * @returns
			 */
			set: (v: string) => {
				if (!Jobs[v]) {
					alt.logError(`[CORE] No Job with the name ${v} detected`);
					return;
				}
				player.job = Jobs[v];
				player.grade = Jobs[v].grades[0];
			},
		});

		/**
		 * Get the current job type
		 * Now is just player.jobType print("none" or "leo")
		 * @returns
		 */
		Object.defineProperty(alt.Player.prototype, 'jobType', {
			get: () => {
				return player.job.type;
			},
		});

		Object.defineProperty(alt.Player.prototype, 'jobGrade', {
			/**
			 * Get the current job, so no more QVCore.Functions.GetPlayer(player.id)
			 * Now is just player.jobGrade
			 * @returns
			 */

			get: () => {
				return Jobs[player.job.name].grades.label;
			},

			/**
			 * The same way now you can set the job with:
			 * player.jobName = "police"
			 * @returns
			 */
			set: (v: number) => {
				if (!Jobs[player.job.name].grades[v]) {
					alt.logError(`[CORE] No Grade with the number ${v} detected`);
					return;
				}
				//            player.job = Jobs[v];
				player.grade = Jobs[player.job.name].grades[v];
			},
		});

		/**
		 * Getter: Return if is boss or not
		 */
		Object.defineProperty(alt.Player.prototype, 'isBoss', {
			get: () => {
				return player.job.grades.isboss || false;
			},
		});

		/**
		 * Getter: Return if the player is on duty or not
		 * Setter: Set the value of OnDuty
		 */
		Object.defineProperty(alt.Player.prototype, 'onDuty', {
			get: () => {
				return player.job.defaultDuty;
			},
			set: (v: boolean) => {
				if (typeof v !== 'boolean') {
					alt.logError(`[CORE] onDuty expect a boolean, you passed ${typeof v}`);
				}
				player.job.defaultDuty = v;
			},
		});

		/**
		 * Getter: Return the firstname of the player
		 */
		Object.defineProperty(alt.Player.prototype, 'firstname', {
			get: () => {
				return player.charinfo.firstname;
			},
		});

		/**
		 * Getter: Return the firstname of the player
		 */
		Object.defineProperty(alt.Player.prototype, 'lastname', {
			get: () => {
				return player.charinfo.lastname;
			},
		});

		/**
		 * Getter: Return the full name of the player
		 */
		Object.defineProperty(alt.Player.prototype, 'fullName', {
			get: () => {
				return `${player.charinfo.firstname} ${player.charinfo.lastname}`;
			},
		});

		/**
		 * Getter: Return the gender of the player
		 */
		Object.defineProperty(alt.Player.prototype, 'gender', {
			get: () => {
				return player.charinfo.gender || 0;
			},
		});
		Object.defineProperty(alt.Player.prototype, 'cash', {
			get: () => {
				return player.money.cash || 0;
			},
		});
		Object.defineProperty(alt.Player.prototype, 'bank', {
			get: () => {
				return player.money.bank || 0;
			},
		});
		Object.defineProperty(alt.Player.prototype, 'black', {
			get: () => {
				return player.money.black || 0;
			},
		});
		Object.defineProperty(alt.Player.prototype, 'cid', {
			get: () => {
				return player.money.black || 0;
			},
		});
	}
}
