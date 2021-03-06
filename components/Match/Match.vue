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
        <HighlightsArea
            :isFixture="isFixture"
            :country="area"
            :date="resultInfo.utcDate"
            :query="query"
        />
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
            homeTeamData: {},
            awayTeamData: {}
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
