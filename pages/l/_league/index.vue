<template>
    <div>
        <Navbar
            :fixtures="fixtures"
            :results="results"
            @matches="matches = $event"
        />
        <div v-if="matches.length">
            <div v-for="match in matches" :key="match.utcdate" ref="matchesref">
                <Match
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
            competition: ""
        };
    },
    async mounted() {
        const leagueId = this.$route.params.league;
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getResultsByLeague&id=${leagueId}`
        );
        const data = await response.json();
        const fixtures = data?.matches.filter(m => m.status === "SCHEDULED");
        const results = data?.matches.filter(m => m.status === "FINISHED");
        this.results = results.slice().reverse();
        this.matches = this.results.slice(0, 10);
        this.fixtures = fixtures;
        this.country = data?.competition?.area?.name;
        this.competition = data?.competition?.name;
        this.dataLoaded = true;
    }
};
</script>
