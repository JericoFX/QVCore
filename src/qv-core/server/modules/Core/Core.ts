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
        get jobName(): string;
    }
}

let Players = {};
const Information = {
    player: '',
    license: 'JERICOFXX',
    citizenid: GenerateCitizenID(),
    money: {},
    charinfo: {
        firstname: '',
        lastname: '',
        birthdate: '',
        gender: 0,
        backstory: '',
        nationality: '',
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
    get jobName() {
        return this.job.name;
    },
    get jobLabel() {
        return this.job.label;
    },
    get jobType() {
        return this.job.type;
    },
    get IsBoss() {
        return this.job.isBoss;
    },
    get jobGradeLevel() {
        return this.job.grade;
    },
    get gangName() {
        return this.gang.name;
    },
    get gangLevel() {
        return this.gang.level;
    },
    get gangBoss() {
        return this.gang.isBoss;
    },
    get firstName() {
        return this.charinfo.firstname;
    },
    get lastName() {
        return this.charinfo.lastname;
    },
    get fullName() {
        return `${this.charinfo.firstname} ${this.charinfo.lastname}`;
    },
    get gender() {
        return this.charinfo.gender;
    },
    set jobName(v: string) {
        if (!Jobs[v.toString()] || typeof v !== 'string') {
            alt.logError(`[CORE] No job with the name ${v} Detected`);
            return;
        }
        this.job = Jobs[v];
    },
    set jobGrade(v: number) {
        if (!Jobs[this.jobName.toString()].grade[v] || typeof v !== 'number') {
            alt.logError(`[CORE] No Grade Detected returning`);
            return;
        }
        this.job.grade = Jobs[this.jobName.toString()].grade[v];
    },
};

export function GetPlayerReady(player) {
    if (!player && !player.valid) {
        alt.logError(`[CORE] Player not valid`);
        return;
    }
    player.license = 'JERICOFXX';
    alt.Player.prototype.citizenid = '';
    alt.Player.prototype.money = {};
    alt.Player.prototype.charinfo = {};
    alt.Player.prototype.metadata = {};
    alt.Player.prototype.job = {};
    alt.Player.prototype.gang = {};
    //alt.Player.prototype.jobName = () => player.job.name;
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
            player.job.label = v;
        },
    });
    player.Login = async () => {
        if (!player && !player.valid) {
            alt.logError(`[CORE] Player not valid`);
            return;
        }
        const exist = await Database.fetchWithSearch(player.license, 'accounts');
        if (exist[0] === undefined) {
            alt.log('NEW PLAYER');
            return player.SetData(true, Information);
        }
        alt.log('PLAYER EXISTED');
        return player.SetData(false, exist[0]);
    };

    player.SetData = async (newPayer, newData) => {
        if (!player && !player.valid) {
            alt.logError(`[CORE] Player not valid`);
        }
        const Dkey = { ...newData };
        if (newPayer) {
            if (newData.firstname !== '') {
                newData.job = Jobs['unemployed'];
                newData.money = { ...Config.money };
                player.setSyncedMeta('charinfo', { ...newData });
            }
        }
        alt.log(Jobs['unemployed']);
        for (const [key, value] of Object.entries(newData)) {
            // alt.Player.prototype[key] = newData[key];
            // player.setSyncedMeta(key, newData[key]);
            //player.citizenid = 'JERE JERE';
            alt.log(key);
            player[key] = newData[key];

            // Object.defineProperty(player, key,{
            //     newData[key],
            //     writable:true
            // });
            //  player.citizenid = newData[key].citizenid;
            // player[key] = newData[key];
            //  alt.log(Dkey[key]);
        }
        alt.log('CID', player.citizenid);
        alt.log('JOBNAME: ', player.jobName);
        Players[player.id] = newData;
        return player.Save();
    };
    player.Test = () => {
        alt.log(Players[player.id]);
        return alt.log('HIIII MIS CHIQUIS');
    };
    player.GetData = () => {
        return Players[player.id];
    };
    player.Save = async () => {
        const exist = await Database.fetchWithSearch(player.license, 'accounts');
        const Data = player.GetData();

        //const Setted = player.SetData()
        if (!exist[0] === undefined) {
            await Database.updatePartialData(exist._id, { ...Data }, 'accounts');
        } else {
            const Jerico = await Database.insertData(Data, 'accounts', false);
        }
    };
}
function GenerateCitizenID() {
    const uid = new ShortUniqueId({
        dictionary: 'alphanum_upper',
        length: 6,
    });
    return uid();
}