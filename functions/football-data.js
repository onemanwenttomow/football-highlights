let FOOTBALLAPI;
// try {
//     const secrets = require("../secrets.json");
//     FOOTBALLAPI = secrets.FOOTBALLAPI;
// } catch (error) {
//     FOOTBALLAPI = process.env.FOOTBALLAPI;
// }
FOOTBALLAPI = process.env.FOOTBALLAPI;

const axios = require("axios");
exports.handler = async (event, context) => {
    const { perform, id } = event.queryStringParameters;
    const headers = {
        headers: { "X-Auth-Token": FOOTBALLAPI }
    };

    if (perform === "getResultsByLeage") {
        const url = `http://api.football-data.org/v2/competitions/${id}/matches`;
        const { data } = await axios.get(url, headers);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    }

    if (perform === "getLatestResults") {
        const url = `https://api.football-data.org/v2/teams/${id}/matches`;
        const { data } = await await axios.get(url, headers);
        return {
            statusCode: 200,
            body: JSON.stringify(data.matches)
        };
    }
};
