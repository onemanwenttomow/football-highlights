// const { FOOTBALLAPI } = require("../secrets.json");
const FOOTBALLAPI = process.env.FOOTBALLAPI

const axios = require("axios");
exports.handler = async (event, context) => {
    const { perform, id } = event.queryStringParameters;
    const headers = {
        headers: { "X-Auth-Token": FOOTBALLAPI }
    };

    if (perform === "getTeamById") {
        const url = `https://api.football-data.org/v2/teams/${id}`;
        const { data } = await axios.get(url, headers);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    }

    if (perform === "getLastFiveResultsByTeam") {
        const url = `https://api.football-data.org/v2/teams/${id}/matches?limit=5&status=FINISHED`;
        const { data } = await axios.get(url, headers);
        console.log('data: ',data);
        return {
            statusCode: 200,
            body: JSON.stringify(data.matches)
        };
    }

    if (perform === "getTeamsByLeague") {
        const url = `https://api.football-data.org/v2/competitions/${id}/teams`;
        const { data } = await axios.get(url, headers);
        console.log("data: ", data);
        return {
            statusCode: 200,
            body: JSON.stringify(data.teams)
        };
    }
    
};
