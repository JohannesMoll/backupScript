import { Stats, promises as fsPromises } from 'fs';
import { constants } from 'fs/promises';
import { Telegraf, Telegram } from 'telegraf'

/// Config area
const fileNameBackupFileDir="nextcloud-filedir.tar.gz";
const fileNameBackupDataDir="nextcloud-datadir.tar.gz";
const fileNameBackupDb="nextcloud-db.sql";

const nextcloudFileDir="/containers/nextcloud/app";
const nextcloudDataDir="/containers/nextcloud/data";
const nextcloudDatabase=process.env.NEXTCLOUD_DB!;
const dbUser = process.env.NEXTCLOUD_DB_USER!;
const dbPassword=process.env.NEXTCLOUD_DB_PASSWORD!;
const webserverUser="www-data";

const dockerdb="nextcloud-db"
const dockerapp="nextcloud-app"

const backupMainDir="/backup/";
const keepBackups = 3;


// Script area
const currentDate = new Date().toISOString().slice(0,10);

const backupDir = backupMainDir + currentDate + "/";


async function create_backup(telegram : Telegram) {
    // await telegram.sendMessage(process.env.CHAT_ID!, `Creating Backup into: ${backupDir}`);
    // Check file access
    try {
        await fsPromises.access(nextcloudFileDir, constants.R_OK | constants.W_OK);
        await fsPromises.access(nextcloudDataDir, constants.R_OK | constants.W_OK);
    } catch {
        console.log("Script must be run as root!");
    }
    // Check if Backup Dir already exists
    if ((await fsPromises.stat(backupDir)).isDirectory()){
        console.log("directory")
    }
}

export default create_backup;