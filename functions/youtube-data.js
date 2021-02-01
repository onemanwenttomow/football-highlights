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

exports.handler = async event => {
    const { date, q, country } = event.queryStringParameters;
    console.log("date, query: ", date, q);
    // play around with the config
    // i.e. skysports for Premier League
    // dazn for bundesliga?
    // need to look up serie a
    // need to look up la liga
    // need to not embed video, but instead link to youtube...
    const channelByCountry = {
        england: "UCuOwl-VgqBHOzR8hWnonBcA",
        germany: "UClBFnQJMlinWDCvfSXj60CA",
        italy: "UCBJeMCIeLQos7wacox4hmLQ",
        spain: "UCTv-XvfzLX3i4IGWAm4sbmA"
    };
    const channelId = channelByCountry[country];
    const results = await youtube.searchVideos(q, 5, {
        channelId: channelId,
        // order: "relevance",
        publishedAfter: date,
        // type: ["video"],
        // videoDefinition: "high",
        // videoDuration: "short",
        // videoEmbeddable: "true",
        // videoType: "videoTypeUnspecified",
        regionCode: "DE"
    });
    return {
        statusCode: 200,
        body: JSON.stringify(results)
    };
};
