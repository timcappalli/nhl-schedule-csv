const axios = require('axios');
const fs = require('fs/promises');
const { DateTime } = require('luxon');

// UPDATE THESE
const TEAM = "BOS";
const SEASON = "20252026";
const TIMEZONE = "America/New_York";

async function getTeamInfo() {
    try {
        const response = await axios.get(`https://api.nhle.com/stats/rest/en/team`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching team details:`, error);
        throw error;
    }
}

function findTeamName(teams, triCode) {
    return teams.find(team => team.triCode === triCode)?.fullName || null;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,
        '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

function formatTime(isoString, timeZone) {
    const dt = DateTime.fromISO(isoString).setZone(timeZone);
    return dt.toFormat('HH:mm');
}

async function getTeamSchedule(TEAM, SEASON) {
    try {
        const response = await axios.get(`https://api-web.nhle.com/v1/club-schedule-season/${TEAM}/${SEASON}`);
        return response.data.games;
    } catch (error) {
        console.error(`Error fetching schedule for ${TEAM}:`, error);
        throw error;
    }
};

(async () => {
    try {
        const teams = await getTeamInfo();
        const teamName = findTeamName(teams, TEAM);
        const schedule = await getTeamSchedule(TEAM, SEASON);

        let csv = ["DATE,TIME,AWAY,HOME,TYPE"]

        schedule.forEach(game => {
            let date = formatDate(game.startTimeUTC);
            let time = formatTime(game.startTimeUTC, TIMEZONE);
            let awayTeam = findTeamName(teams, game.awayTeam.abbrev);
            let homeTeam = findTeamName(teams, game.homeTeam.abbrev);
            let type = game.gameType === 2 ? "Regular Season" : "Preseason";

            csv.push(`${date},${time},${awayTeam},${homeTeam},${type}`);
        });

        const csvOutput = csv.join('\n');

        await fs.writeFile(`${__dirname}/${TEAM}-${SEASON}.csv`, csvOutput);
        console.log(`${teamName} ${SEASON.substring(0, 4) + "-" + SEASON.substring(4)} schedule CSV file successfully generated.`);

    } catch (error) {
        console.error('Could not generate CSV file:', error);
    }
})();