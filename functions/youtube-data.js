const YouTube = require("simple-youtube-api");
let GOOGLEAPI;
try {
    const secrets = require("../secrets.json");
    GOOGLEAPI = secrets.GOOGLEAPI;
} catch (error) {
    GOOGLEAPI = process.env.GOOGLEAPI;
}
// GOOGLEAPI = process.env.GOOGLEAPI;
const youtube = new YouTube(GOOGLEAPI);
const channelByCountry = {
    england: "UCuOwl-VgqBHOzR8hWnonBcA",
    germany: "UClBFnQJMlinWDCvfSXj60CA",
    italy: "UCBJeMCIeLQos7wacox4hmLQ",
    spain: "UCTv-XvfzLX3i4IGWAm4sbmA"
};

exports.handler = async event => {
    const { date, q, country } = event.queryStringParameters;
    const channelId = channelByCountry[country];
    const results = await youtube.searchVideos(q, 5, {
        channelId: channelId,
        publishedAfter: date,
        regionCode: "DE"
    });
    return {
        statusCode: 200,
        body: JSON.stringify(results)
    };
};
