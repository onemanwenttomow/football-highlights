<template>
    <div v-if="latestResults.length">
        <div v-for="result in latestResults" :key="result.utcdate">
            <Result
                :area="country"
                :result-info="result"
                :competition-name="competition"
            />
        </div>
    </div>
    <div v-else class="relative">
        <div class="min-w-full h-96 bg-gray-300 p-8 my-2 skeleton"></div>
        <SkeletonResults v-for="(load, i) in loading" :key="i" />
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
            latestResults: [],
            loading: [1, 1, 1],
            country: "",
            competition: ""
        };
    },
    async mounted() {
        const leagueId = this.$route.params.league;
        console.log("leagueId: ", leagueId);
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getResultsByLeage&id=${leagueId}`
        );
        const data = await response.json();
        console.log("data: ", data);
        this.latestResults = data?.matches.reverse();
        this.country = data?.competition?.area?.name;
        this.competition = data?.competition?.name;
    }
};
</script>
