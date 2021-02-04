<template>
    <div
        v-if="homeTeamData && awayTeamData"
        class="relative bg-blue-700 my-6 px-4 pb-4 text-white"
    >
        <div class="slash"></div>

        <div class="flex flex-col items-center">
            <div class="bg-red-700 p-2">
                {{ competition }}
            </div>
            <div class="pb-5">
                {{ date }}
            </div>
        </div>

        <div>
            <div class="flex">
                <nuxt-link :to="`/t/${homeTeamData.id}`" no-prefetch>
                    <img
                        class="h-12 w-12 mr-2"
                        :src="homeTeamData.crestUrl"
                        :alt="homeTeamData.shortName"
                    />
                </nuxt-link>
                <nuxt-link :to="`/t/${awayTeamData.id}`" no-prefetch>
                    <img
                        class="h-12 w-12 mr-2"
                        :src="awayTeamData.crestUrl"
                        :alt="awayTeamData.shortName"
                    />
                </nuxt-link>
            </div>
            <div class="text-4xl font-bold">
                <div class="flex justify-between">
                    <nuxt-link :to="`/t/${homeTeamData.id}`">
                        <div>
                            {{ homeTeamData.shortName }}
                        </div>
                    </nuxt-link>
                    <div
                        class="py-1 px-5 bg-red-700 flex justify-center align-center"
                    >
                        {{ homeScore }}
                    </div>
                </div>
                <div class="flex justify-between mt-2">
                    <nuxt-link :to="`/t/${awayTeamData.id}`">
                        <div>
                            {{ awayTeamData.shortName }}
                        </div>
                    </nuxt-link>
                    <div
                        class="py-1 px-5 bg-red-700 flex justify-center align-center"
                    >
                        {{ awayScore }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center">
            <button
                class="bg-white text-blue-800 px-4 py-2 mt-8 font-bold uppercase"
                @click="getHighlights"
                :disabled="btnDisabled"
            >
                {{ btnText }}
            </button>
            <div v-if="videos.length" class="mt-4">
                <a
                    :href="`https://www.youtube.com/watch?v=${videos[0].id}`"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        :src="
                            `https://img.youtube.com/vi/${videos[0].id}/0.jpg`
                        "
                    />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
const getTeams = () => import(`~/assets/teams.json`).then(t => t.default || t);

export default {
    props: {
        area: {
            type: String,
            required: false
        },
        competitionName: {
            type: String
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
            awayTeamData: {},
            btnText: "Check for Highlights",
            btnDisabled: false
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
            return `${this.homeTeamData.shortName} v ${this.awayTeamData.shortName} ${this.homeScore}-${this.awayScore}`;
        },
        competition() {
            return this.competitionName || this.resultInfo?.competition?.name;
        },
        homeScore() {
            return this.resultInfo.score.fullTime.homeTeam;
        },
        awayScore() {
            return this.resultInfo.score.fullTime.awayTeam;
        },
        date() {
            return this.resultInfo.utcDate;
        }
    },
    methods: {
        async getHighlights() {
            this.btnDisabled = true;
            const country = this.area.toLowerCase();
            console.log(
                `/.netlify/functions/youtube-data?date=${this.date}&q=${this.query}&country=${country}`
            );
            const url = `/.netlify/functions/youtube-data?date=${this.date}&q=${this.query}&country=${country}`;
            const response = await fetch(url);
            const results = await response.json();
            console.log("results: ", results);
            this.btnText = results.length
                ? "Highlights below"
                : "Sorry, no highlights yet";
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
