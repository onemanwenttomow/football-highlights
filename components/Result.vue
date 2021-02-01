<template>
    <div class="relative bg-blue-700 my-6 px-4 pb-4">
        <div class="slash"></div>

        <div class="flex justify-center pb-10">
            {{ date }}
        </div>

        <div>
            <div class="flex">
                <img
                    class="h-12 w-12 mr-2"
                    :src="homeTeamData.crestUrl"
                    :alt="homeTeamData.shortName"
                />
                <img
                    class="h-12 w-12 mr-2"
                    :src="awayTeamData.crestUrl"
                    :alt="awayTeamData.shortName"
                />
            </div>
            <div class="text-4xl text-white font-bold">
                <div class="flex justify-between">
                    <div>
                        {{ homeTeamData.shortName }}
                    </div>
                    <div
                        class="py-1 px-4 bg-red-700 flex justify-center align-center"
                    >
                        {{ homeScore }}
                    </div>
                </div>
                <div class="flex justify-between mt-2">
                    <div>
                        {{ awayTeamData.shortName }}
                    </div>
                    <div
                        class="py-1 px-4 bg-red-700 flex justify-center align-center"
                    >
                        {{ awayScore }}
                    </div>
                </div>
            </div>
        </div>
        <button @click="getHighlights">Get Highlights</button>
        <div v-if="videos.length">
            <a
                :href="`https://www.youtube.com/watch?v=${videos[0].id}`"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    :src="`https://img.youtube.com/vi/${videos[0].id}/0.jpg`"
                />
            </a>
        </div>
    </div>
</template>

<script>
const getTeams = () => import(`~/assets/teams.json`).then(t => t.default || t);

export default {
    props: {
        competition: {
            type: String,
            required: true
        },
        homeTeam: {
            type: String,
            required: true
        },
        awayTeam: {
            type: String,
            required: true
        },
        homeScore: {
            type: Number,
            required: true
        },
        awayScore: {
            type: Number,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        resultInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            videos: [],
            homes: [],
            homeTeamData: {},
            awayTeamData: {}
        };
    },
    async mounted() {
        this.teams = await getTeams();
        this.homeTeamData = this.teams.find(
            t => t.id == this.resultInfo.homeTeam.id
        );
        this.awayTeamData = this.teams.find(
            t => t.id == this.resultInfo.awayTeam.id
        );
    },
    computed: {
        query() {
            return `${this.homeTeam} v ${this.awayTeam} ${this.homeScore}-${this.awayScore}`;
        }
    },
    methods: {
        async getHighlights() {
            const country = this.area.toLowerCase();
            const url = `/.netlify/functions/youtube-data?date=${this.date}&q=${this.query}&country=${country}`;
            const response = await fetch(url);
            const results = await response.json();
            this.videos = results;
        }
    }
};
</script>

<style>
.slash {
    height: 100%;
    width: 100%;
    position: absolute;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.2), transparent),
        linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2)),
        linear-gradient(
            171deg,
            hsla(0, 0%, 100%, 0.09) 45%,
            hsla(0, 0%, 100%, 0) 0
        );
    background-size: 0px 100%, 0px 100%, 100%;
    left: 0;
    background-repeat: no-repeat;
    pointer-events: none;
}
</style>
