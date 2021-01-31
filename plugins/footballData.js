const cache = {};
export default async function (context, inject) {
    let FOOTBALLAPI;
    // try {
    //     const secrets = require("../secrets.json");
    //     FOOTBALLAPI = secrets.FOOTBALLAPI;
    // } catch (error) {
    //     FOOTBALLAPI = process.env.FOOTBALLAPI
    // }
    FOOTBALLAPI = process.env.FOOTBALLAPI

    const headers = {
        headers: { "X-Auth-Token": FOOTBALLAPI }
    };

    inject("footballApi", {
        getTeamsByLeague
    });

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
        console.log('error: ',error);
        return {
            ok: false,
            status: 500,
            statusText: error.message,
            json: {}
        };
    }
}
