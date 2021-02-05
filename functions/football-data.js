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
        const url = `https://api.football-data.org/v2/teams/${id}/matches?status=FINISHED`;
        const championsLeage = `https://api.football-data.org/v2/competitions/CL/matches?status=FINISHED`;

        const [{ data }, { data: cl }] = await Promise.all([
            await axios.get(url, headers),
            await axios.get(championsLeage, headers)
        ]);
        const championsLeageByTeam = cl.matches
            .filter(m => m.homeTeam.id == id || m.awayTeam.id == id)
            .map(m => {
                return {
                    ...m,
                    competition: {
                        name: "Champions League"
                    }
                };
            });
        let matches = [...data.matches, ...championsLeageByTeam];
        matches = matches.sort(
            (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
        );
        return {
            statusCode: 200,
            body: JSON.stringify(matches)
        };
    }
};
