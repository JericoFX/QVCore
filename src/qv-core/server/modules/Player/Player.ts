///// <reference types="@altv/types-server" />
//import * as alt from 'alt-server';
//import Database from '@stuyk/ezmongodb';
//import ShortUniqueId from 'short-unique-id';
//import { Config } from '../../../shared/config';
//import { Jobs } from '../../../shared/jobs';
//let Player = {};
//
//let Players = {};
//Player.CreatePlayer = function (PlayerDatas, Offlines, player = false) {
//    this.PlayerData = PlayerDatas;
//    this.Offline = Offlines;
//    this.Functions = {};
//    this.Functions.UpdatePlayerData = function () {
//        alt.emit('QVCore::Player::SetPlayerData', PlayerDatas);
//        alt.emitClient(PlayerDatas.player, 'QVCore::Player::SetPlayerData', PlayerDatas);
//    };
//    this.Functions.SetJob = function (job, grade) {
//        let jobs = job.toLowerCase();
//        let grades = grade || '0';
//        if (!Jobs[jobs]) return;
//        this.PlayerData.job.name = jobs;
//        this.PlayerData.job.label = Jobs[jobs].label;
//        this.PlayerData.job.onduty = Jobs[jobs].defaultDuty;
//        this.PlayerData.job.type = Jobs[jobs].type || 'none';
//        if (Jobs[jobs].grades[grades]) {
//            const jobgrade = Jobs[jobs].grades[grades];
//            this.PlayerData.job.grade.name = jobgrade.name;
//            this.PlayerData.job.grade.level = grades;
//            this.PlayerData.job.grade.payment = jobgrade.payment || 30;
//            this.PlayerData.job.grade.isboss = jobgrade.isboss || false;
//        } else {
//            this.PlayerData.job.grade.name = 'No Grades';
//            this.PlayerData.job.grade.level = 0;
//            this.PlayerData.job.payment = 30;
//            this.PlayerData.job.isboss = false;
//        }
//        //PlayerDatas.player.setSyncedMeta('job', this.PlayerData.job);
//    };
//    this.Functions.SetPlayerData = function (key, val) {
//        if (!typeof key === 'string') return;
//        this.PlayerData[key] = val;
//        player.setSyncedMeta(key, val);
//        this.Functions.UpdatePlayerData();
//    };
//    this.Functions.SetMetaData = function (meta, val) {
//        this.PlayerData.metadata[meta] = val;
//        player.setSyncedMeta(meta, val);
//        this.Functions.UpdatePlayerData();
//    };
//    this.Functions.GetMetaData = function (meta) {
//        return this.PlayerData.metadata[meta] || false;
//    };
//    this.Functions.Save = function (id) {
//        Player.Save(id);
//    };
//    alt.log("ID: "+player.id,this.PlayerData.player.id)
//    Players[player.id.toString()] = this;
//    Player.Save(this.PlayerData.player);
//    alt.emitClient(PlayerDatas.player, 'QVCore::Server::PlayerLoaded', this.PlayerData);
//    this.Functions.UpdatePlayerData();
//};
//
//Player.Login = async (player, license: string, newData: Object) => {
//    if (!player && !player.valid) return;
//    const Data = await Database.fetchWithSearch(license, 'accounts');
//    if (Data[0] === undefined) {
//        alt.logError('[CORE] No player data Detected');
//        return Player.CheckPlayerData(player, {});
//    }
//    alt.log('[CORE] ~g~Player Detected~g~');
//    // @ts-ignore
//    return Player.CheckPlayerData(player, Data[0]);
//};
//
//Player.CheckPlayerData = (player, Data) => {
//    let PlayerData = Data || {
//        id: 0,
//        player: '',
//        license: '',
//        name: '',
//        citizenid: '',
//        money: {},
//        charinfo: {
//            firstname: '',
//            lastname: '',
//            birthdate: '',
//            gender: 0,
//            backstory: '',
//            nationality: '',
//        },
//        metadata: {},
//        job: {},
//        gang: {},
//    };
//    if (player.valid) {
//        PlayerData.id = player.id.toString();
//        PlayerData.player = alt.Player.getByID(player.id);
//        PlayerData.license = PlayerData.license || player.getSyncedMeta('license');
//        PlayerData.name = PlayerData.name || 'JERICOFX';
//        PlayerData.citizenid = PlayerData.citizenid || GenerateCitizenID();
//        PlayerData.money = PlayerData.money || { ...Config.money };
//        PlayerData.charinfo = PlayerData.charinfo || {};
//        PlayerData.charinfo.firstname = PlayerData.charinfo.firstname || 'Firstname';
//        PlayerData.charinfo.lastname = PlayerData.charinfo.lastname || 'Lastname';
//        PlayerData.charinfo.birthdate = PlayerData.charinfo.birthdate || '00-00-0000';
//        PlayerData.charinfo.gender = PlayerData.charinfo.gender || 0;
//        PlayerData.charinfo.backstory = PlayerData.charinfo.backstory || 'placeholder backstory';
//        PlayerData.charinfo.nationality = PlayerData.charinfo.nationality || 'USA';
//        PlayerData.metadata = PlayerData.metadata || {};
//        PlayerData.metadata['hunger'] = PlayerData.metadata['hunger'] || 100;
//        PlayerData.metadata['thirst'] = PlayerData.metadata['thirst'] || 100;
//        PlayerData.metadata['stress'] = PlayerData.metadata['stress'] || 0;
//        PlayerData.metadata['isdead'] = PlayerData.metadata['isdead'] || false;
//        PlayerData.metadata['inlaststand'] = PlayerData.metadata['inlaststand'] || false;
//        PlayerData.metadata['armor'] = PlayerData.metadata['armor'] || 0;
//        PlayerData.metadata['ishandcuffed'] = PlayerData.metadata['ishandcuffed'] || false;
//        PlayerData.metadata['tracker'] = PlayerData.metadata['tracker'] || false;
//        PlayerData.metadata['injail'] = PlayerData.metadata['injail'] || 0;
//        PlayerData.metadata['jailitems'] = PlayerData.metadata['jailitems'] || {};
//        PlayerData.metadata['status'] = PlayerData.metadata['status'] || {};
//        PlayerData.metadata['phone'] = PlayerData.metadata['phone'] || {};
//        PlayerData.metadata['fitbit'] = PlayerData.metadata['fitbit'] || {};
//        PlayerData.metadata['commandbinds'] = PlayerData.metadata['commandbinds'] || {};
//        PlayerData.metadata['bloodtype'] = 'AV-0';
//        PlayerData.metadata['dealerrep'] = PlayerData.metadata['dealerrep'] || 0;
//        PlayerData.metadata['craftingrep'] = PlayerData.metadata['craftingrep'] || 0;
//        PlayerData.metadata['attachmentcraftingrep'] = PlayerData.metadata['attachmentcraftingrep'] || 0;
//        PlayerData.metadata['currentapartment'] = PlayerData.metadata['currentapartment'] || null;
//        PlayerData.metadata['jobrep'] = PlayerData.metadata['jobrep'] || {};
//        PlayerData.metadata['jobrep']['tow'] = PlayerData.metadata['jobrep']['tow'] || 0;
//        PlayerData.metadata['jobrep']['trucker'] = PlayerData.metadata['jobrep']['trucker'] || 0;
//        PlayerData.metadata['jobrep']['taxi'] = PlayerData.metadata['jobrep']['taxi'] || 0;
//        PlayerData.metadata['jobrep']['hotdog'] = PlayerData.metadata['jobrep']['hotdog'] || 0;
//        PlayerData.metadata['callsign'] = PlayerData.metadata['callsign'] || 'NO CALLSIGN';
//        PlayerData.metadata['licences'] = PlayerData.metadata['licences'] || {
//            ['driver']: true,
//            ['business']: false,
//            ['weapon']: false,
//        };
//        PlayerData.metadata['inside'] = PlayerData.metadata['inside'] || {
//            house: null,
//            apartment: {
//                apartmentType: null,
//                apartmentId: null,
//            },
//        };
//        PlayerData.job = PlayerData.job || {};
//        PlayerData.job.name = PlayerData.job.name || 'unemployed';
//        PlayerData.job.label = PlayerData.job.label || 'Civilian';
//        PlayerData.job.payment = PlayerData.job.payment || 10;
//        PlayerData.job.type = PlayerData.job.type || 'none';
//        PlayerData.job.isboss = PlayerData.job.isboss || false;
//        PlayerData.job.grade = PlayerData.job.grade || {};
//        PlayerData.job.grade.name = PlayerData.job.grade.name || 'Freelancer';
//        PlayerData.job.grade.level = PlayerData.job.grade.level || 0;
//        PlayerData.gang = PlayerData.gang || {};
//        PlayerData.gang.name = PlayerData.gang.name || 'none';
//        PlayerData.gang.label = PlayerData.gang.label || 'No Gang Affiliaton';
//        PlayerData.gang.isboss = PlayerData.gang.isboss || false;
//        PlayerData.gang.grade = PlayerData.gang.grade || {};
//        PlayerData.gang.grade.name = PlayerData.gang.grade.name || 'none';
//        PlayerData.gang.grade.level = PlayerData.gang.grade.level || 0;
//        // Object.defineProperties
//        for (const [key, value] of Object.entries(PlayerData)) {
//            player.setSyncedMeta(key, value);
//        }
//        Object.defineProperty(PlayerData, 'jobName', {
//            get(): string {
//                return this.job.name;
//            },
//            set(v: string): string {
//                if (!Jobs[v]) {
//                    alt.logError(`[CORE] No job with the name ${v} Detected in Jobs.ts`);
//                    return;
//                }
//                this.job.name = v;
//            },
//        });
//        Players[player.id.toString()] = this;
//
//        return Player.CreatePlayer(PlayerData, false, player);
//    }
//};
//
//Player.Save = async (player) => {
//    if (!player.valid) {
//        return;
//    }
//    const coords = player.pos;
//    let Data: Object = Players[player.id.toString()].PlayerData;
//
//    Data.position = coords;
//    if (Data) {
//        const awa = await Database.fetchAllByField('license', Data.license, 'accounts');
//        if (awa.length > 0) {
//            try {
//                await Database.updatePartialData(awa._id, { ...Data }, 'accounts');
//                alt.log(`~g~ Player ${Data.player.name} saved! ~g~`);
//                return true;
//            } catch (error) {
//                alt.logError(error);
//            }
//        } else {
//            try {
//                const Jerico = await Database.insertData(JSON.parse(JSON.stringify(Data)), 'accounts', false);
//                alt.log(`~g~ Player Inserted ${Data.player.name} saved! ~g~`);
//                return true;
//            } catch (error) {
//                alt.logError(error);
//            }
//        }
//    }
//};
//
//function GenerateCitizenID() {
//    const uid = new ShortUniqueId({
//        dictionary: 'alphanum_upper',
//        length: 6,
//    });
//    return uid();
//}
//Player.GetPlayerById = (id) => {
//    alt.log('RETURN VALUE', Players);
//    return Players[id.toString()];
//};
//export default Player
