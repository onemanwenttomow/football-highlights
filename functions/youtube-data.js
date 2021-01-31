const YouTube = require("simple-youtube-api");
let GOOGLEAPI;
// try {
//     const secrets = require("../secrets.json");
//     GOOGLEAPI = secrets.GOOGLEAPI;
// } catch (error) {
//     GOOGLEAPI = process.env.GOOGLEAPI;
// }
GOOGLEAPI = process.env.GOOGLEAPI;
const youtube = new YouTube(GOOGLEAPI);

exports.handler = async (event) => {
    const { date, q } = event.queryStringParameters;
    console.log("date, query: ", date, q);
    const results = await youtube.searchVideos(q, 5, {
        order: "relevance",
        publishedAfter: date,
        type: ["video"],
        videoDefinition: "high",
        videoDuration: "short",
        videoEmbeddable: "true",
        videoType: "videoTypeUnspecified"
    });
    return {
        statusCode: 200,
        body: JSON.stringify(results)
    };
};
