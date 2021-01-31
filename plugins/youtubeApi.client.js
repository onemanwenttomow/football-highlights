export default async function (context, inject) {
    const GOOGLEAPI = process.env.GOOGLEAPI
    // const { GOOGLEAPI } = await import("../secrets.json");

    inject("youtubeApi", {
        getHighlightsByQuery
    });

    const cache = {};

    async function loadClient() {
        try {
            gapi.client.setApiKey(GOOGLEAPI);
            await gapi.client.load(
                "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
            );
            console.log("GAPI client loaded for API");
        } catch (error) {
            console.error("Error loading GAPI client for API", error);
        }
    }

    async function getHighlightsByQuery(date, query) {
        return new Promise((resolve, reject) => {
            if (query in cache) {
                return result(cache[query]);
            }
            gapi.load("client:auth2", async function() {
                await loadClient();
                const config = {
                    order: "relevance",
                    publishedAfter: date,
                    q: query,
                    type: ["video"],
                    videoDefinition: "high",
                    videoDuration: "short",
                    videoEmbeddable: "true",
                    videoType: "videoTypeUnspecified"
                };
                const data = await gapi.client.youtube.search.list(config)
                cache[query] = data;
                resolve(data);
            });

        })
    }

  
}
