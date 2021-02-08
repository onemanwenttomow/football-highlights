<template>
    <div
        v-if="homeTeamData && awayTeamData"
        class="relative bg-blue-700 my-6 px-4 pb-4 text-white result-card"
    >
        <div class="slash"></div>

        <div class="flex flex-col items-center">
            <div class="bg-red-700 p-2" @click="show = !show">
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
        <div v-if="isFixture" class="flex flex-col justify-center">
            <button
                class="bg-white text-blue-800 px-4 py-2 mt-8 font-bold uppercase"
                @click="getHighlights"
                :disabled="btnDisabled"
            >
                {{ btnText }}
            </button>
            <div v-if="videos.length" class="m-auto mt-4">
                <a
                    :href="`https://www.youtube.com/watch?v=${videos[0].id}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex justify-center items-center"
                >
                    <img
                        src="/youtube-play.svg"
                        alt="play button"
                        class="h-24 absolute left-1/2 opacity-0"
                        v-if="show"
                        :class="show && 'bounce'"
                    />
                    <img
                        :src="
                            `https://img.youtube.com/vi/${videos[0].id}/0.jpg`
                        "
                        @load="show = true"
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
            btnDisabled: false,
            show: false
        };
    },
    watch: {
        resultInfo() {
            this.setupTeams();
        }
    },
    async mounted() {
        this.setupTeams();
    },
    computed: {
        query() {
            return `${this.homeTeamData.shortName} v ${this.awayTeamData.shortName} ${this.homeScore}-${this.awayScore}`;
        },
        competition() {
            return this.competitionName || this.resultInfo?.competition?.name;
        },
        isFixture() {
            return this.resultInfo.score.winner;
        },
        homeScore() {
            return this.isFixture
                ? this.resultInfo.score.fullTime.homeTeam
                : "-";
        },
        awayScore() {
            return this.isFixture
                ? this.resultInfo.score.fullTime.awayTeam
                : "-";
        },
        date() {
            return `${this.kickOffTime}, ${this.prettyDate}`;
        },
        kickOffTime() {
            const d = new Date(this.resultInfo.utcDate);
            const h = d.getHours();
            const m = d.getMinutes() + "";
            return `${h}:${m.length > 1 ? m : m + 0}`;
        },
        prettyDate() {
            const date = new Date(this.resultInfo.utcDate);
            const prettyDate = new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full"
            }).format(date);
            return prettyDate;
        }
    },
    methods: {
        async setupTeams() {
            this.teams = await getTeams();
            this.homeTeamData = this.teams.find(
                t => t.id == this.resultInfo.homeTeam.id
            );
            this.awayTeamData = this.teams.find(
                t => t.id == this.resultInfo.awayTeam.id
            );
        },
        async getHighlights() {
            this.btnText = "checking....";
            this.btnDisabled = true;
            const country = this.area.toLowerCase();
            const date = this.resultInfo.utcDate;
            const url = `/.netlify/functions/youtube-data?date=${date}&q=${this.query}&country=${country}`;
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

.bounce {
    animation: bounce-in 0.5s ease-in 0.1s 1 normal forwards;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
