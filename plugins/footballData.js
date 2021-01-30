const cache = {};
export default async function (context, inject) {
    // const FOOTBALLAPI = process.env.FOOTBALLAPI
    const { FOOTBALLAPI } = await import("../secrets.json");
 
    
    const headers = {
        headers: { "X-Auth-Token": FOOTBALLAPI }
    };

    inject("footballApi", {
        getTeamsByLeague,
        getLastFiveResultsByTeam,
        getTeamById
    });

    async function getTeamById(teamId) {
        try {
            if (teamId in cache) {
                console.log('serving from cache');
                return cache[teamId]
            }
            const url = `https://api.football-data.org/v2/teams/${teamId}`;
            const { data } = await context.$axios.get(url, headers);
            cache[teamId] = data;
            return data;
        } catch (error) {
            return getErrorResponse(error);
        }
    }

    async function getLastFiveResultsByTeam(teamId) {
        try {
            const url =
                `https://api.football-data.org/v2/teams/${teamId}/matches?limit=5&status=FINISHED`;
            const { data } = await context.$axios.get(url, headers);
            return data.matches;
        } catch (error) {
            return getErrorResponse(error);
        }
    }

    async function getTeamsByLeague(leagueId) {
        try {
            if (leagueId in cache) {
                console.log("serving from cache");
                return cache[leagueId];
            }
            const url =
                `https://api.football-data.org/v2/competitions/${leagueId}/teams`;
            const { data } = await context.$axios.get(url, headers);
            cache[leagueId] = data.teams;
            return data.teams;
        } catch (error) {
            return getErrorResponse(error);
        }
    }

    function getErrorResponse(error) {
        return {
            ok: false,
            status: 500,
            statusText: error.message,
            json: {}
        };
    }
}
