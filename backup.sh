
#
# Check for root
#
if [ "$(id -u)" != "0" ]
then
        errorecho "ERROR: This script has to be run as root!"
        exit 1
fi

#
# Check if backup dir already exists
#
if [ ! -d "${backupdir}" ]
then
        mkdir -p "${backupdir}"
else
        errorecho "ERROR: The backup directory ${backupdir} already exists!"
        exit 1
fi

#
# Set maintenance mode
#
echo "Wartungsmodus fuer Nextcloud wird aktiviert"
docker exec "${dockerapp}" su -s /bin/bash "${webserverUser}" -c "php occ maintenance:mode --on"
echo "Status: OK"
echo


#
# Backup file and data directory
#
echo "Erstellung des Backups eurer Nextcloud Installation"
tar -cpzf "${backupdir}/${fileNameBackupFileDir}" -C "${nextcloudFileDir}" .
echo "Status: OK"
echo

echo "Erstellung des Backups eurer Nextcloud Daten" # TODO: Log size of data dir, show progress
tar -cpzf "${backupdir}/${fileNameBackupDataDir}"  -C "${nextcloudDataDir}" .
echo "Status: OK"
echo

#
# Backup DB
#
echo "Erstellung des Backups eurer Nextcloud Datenbank"
docker exec "${dockerdb}" /usr/bin/mysqldump -u "${dbUser}"  -p"${dbPassword}" "${nextcloudDatabase}" > "${backupdir}/${fileNameBackupDb}"
echo "Status: OK"
echo


#
# Alte Dateien loeschen
#
echo "Dateien ueber" "${backupalter}" "Tage loeschen"
find "${backupMainDir}" -type f -mtime +"${backupalter}" -delete
echo "Loesche leere Ordner"
find "${backupMainDir}" -type d -empty -delete

#
# Disable maintenance mode
#
echo "Deaktivierung des Wartungsmodus"
docker exec "${dockerapp}" su -s /bin/bash "${webserverUser}" -c "php occ maintenance:mode --off"
echo "Status: OK"
echo

# TODO: Log size of backup dir and log file of data dir send notification finished