import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import ShortUniqueId from "short-unique-id";

export const QVCore = {Players: {},Functions:{}};

const Jere = {}


function GenerateCitizenID() {
    const uid = new ShortUniqueId({
        dictionary: 'alphanum_upper',
        length: 6,
    });
    return uid();
}

function ReturnDefaultData(newData) {
    return {
        license: newData.license,
        citizenid: GenerateCitizenID(),
        money: {
            bank: 500,
            cash: 500,
            black: 500
        },
        charinfo: {
            firstname: newData.firstname,
            lastname: newData.lastname,
            birthdate: newData.birthdate || '25-04-1992',
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

export class Players {
    public id: number | string


//   get jobName(){
//		return Jere.get(this.id).job
//	}

    public Login = async function (id, citizenid?: boolean | string, newInfo?: Object) {
        this.id = id
        if (citizenid) {
            const exist = await Database.fetchData('citizenid', citizenid.toString(), 'accounts');
            if (exist === undefined) {
                alt.logError(`[CORE] No player with ${citizenid} Detected`);
                return;
            }
            return this.SetPlayerData(id, false, exist)
        }
        return this.SetPlayerData(id, true, ReturnDefaultData(newInfo))
    };
    public GetPlayerData = function (citizenid: string) {
        if (Jere[citizenid]) {
            return Jere[citizenid];
        }
        return false
    };
    public SetPlayerData = function (id: number, newPlayer: boolean, Data: {
        citizenid: string,
        charinfo: { firstname: string, lastname: string },
        job: Object
    }) {
        if (newPlayer) {
            const player = alt.Player.getByID(id)
            player.setSyncedMeta('charinfo', {...Data});
            player.setSyncedMeta("citizenid", Data.citizenid)
            player.setSyncedMeta("fullname", `${Data.charinfo.firstname} ${Data.charinfo.lastname}`)
            player.setSyncedMeta("job", Data.job)
            alt.log(`[CORE] User ~g~${Data.charinfo.firstname}~g~ Created`)
            return
        }
        for (const [key, value] of Object.entries(Data)) {
            const player = alt.Player.getByID(id)
            player.setSyncedMeta(key, Data[key]);
        }
        Jere[Data.citizenid] = Data
    };
}

export class Functions {
    public SetPlayerMetadata = function (citizenid, id, key, value) {
        if (typeof key === "function") return
        const player = alt.Player.getByID(id)
        const CITIZENID = player.getSyncedMeta("citizenid") as number
        Jere[CITIZENID]["metadata"][key] = value
        player.setSyncedMeta(key, value)
        return
    }

    public GetPlayerMetadata = function (citizenid, id, key) {
        if (typeof key === "function") return
        const player = alt.Player.getByID(id)
        const CITIZENID = player.getSyncedMeta("citizenid") as number
        return Jere[CITIZENID]["metadata"][key]
    }

    public UpdatePlayerMetadata = function (citizenid, id, key, value) {
        if (typeof key === "function") return
        const player = alt.Player.getByID(id)
        const CITIZENID = player.getSyncedMeta("citizenid") as number
        if (!player.hasSyncedMeta(key) && Jere[CITIZENID]["metadata"][key] === undefined) {
            alt.logError(`[CORE] No Metadata with the name ${key} Detected`)
            return
        }
		player.setSyncedMeta(key,value)
		Jere[CITIZENID]["metadata"][key] = value
    }

}

QVCore.Players = new Players();
QVCore.Functions = new Functions();
