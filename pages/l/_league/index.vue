<template>
    <div>
        <ul class="flex mb-0 list-none flex-wrap pt-3 flex-row justify-center">
            <li class="flex-auto text-center">
                <a
                    class="uppercase px-5 py-3 block leading-normal"
                    @click="switchTab(1)"
                    :class="{
                        'text-red-700 bg-white': openTab !== 1,
                        'text-white bg-red-700': openTab === 1
                    }"
                >
                    Results
                </a>
            </li>
            <li class="flex-auto text-center">
                <a
                    class="uppercase px-5 py-3 block leading-normal"
                    @click="switchTab(2)"
                    :class="{
                        'text-red-700 bg-white': openTab !== 2,
                        'text-white bg-red-700': openTab === 2
                    }"
                >
                    Fixtures
                </a>
            </li>
        </ul>
        <div v-if="matches.length">
            <div v-for="match in matches" :key="match.utcdate">
                <Result
                    :area="country"
                    :result-info="match"
                    :competition-name="competition"
                />
            </div>
        </div>
        <div v-else class="relative">
            <SkeletonResults v-for="(load, i) in loading" :key="i" />
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ route, error }) {
        const leagueId = route.params.league;
        const data = await import(`~/assets/${leagueId}.json`);
        return {
            teams: data.default
        };
    },
    data() {
        return {
            matches: [],
            fixtures: [],
            results: [],
            loading: [1, 1, 1],
            country: "",
            competition: "",
            openTab: 1
        };
    },
    methods: {
        switchTab(num) {
            this.openTab = num;
            if (num === 1) {
                this.matches = this.results;
            }
            if (num === 2) {
                this.matches = this.fixtures;
            }
        }
    },
    async mounted() {
        const leagueId = this.$route.params.league;
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getResultsByLeage&id=${leagueId}`
        );
        const data = await response.json();
        const fixtures = data?.matches.filter(m => m.status === "SCHEDULED");
        const results = data?.matches.filter(m => m.status === "FINISHED");
        this.results = results.reverse();
        this.matches = this.results;
        this.fixtures = fixtures;
        this.country = data?.competition?.area?.name;
        this.competition = data?.competition?.name;
    }
};
</script>
