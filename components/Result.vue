<template>
    <div>
        <div>
            {{homeTeam}} {{homeScore}} - {{awayScore}} {{awayTeam}} 
        </div>
        <button @click="getHighlights">Get Highlights</button>
        <div v-if="videos.length">
            <youtube
                :key="videos[0].id.videoId"
                :player-vars="{ autoplay: 0 }"
                :video-id="videos[0].id.videoId"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        competition: {
            type: String,
            required: true,
        }, 
        homeTeam: {
            type: String,
            required: true,
        },
        awayTeam: {
            type: String,
            required: true,
        }, 
        homeScore: {
            type: Number,
            required: true,
        },
        awayScore: {
            type: Number,
            required: true,
        },
        date: {
            type: String,
            required: true,
        }
    }, 
    data() {
        return {
            videos: []
        }
    },
    computed: {
        query() {
            return `${this.homeTeam} v ${this.awayTeam} ${this.homeScore}-${this.awayScore}`;
        }
    },
    methods: {
        async getHighlights() {
            console.log('mounted get videos', this.query, this.date);
            console.log('this: ',this);
            const { result } = await this.$youtubeApi.getHighlightsByQuery(this.date, this.query);
            console.log('result: ',result);
            this.videos = result.items;
        }
    }
};
</script>
