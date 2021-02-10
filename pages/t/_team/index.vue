<template>
    <div v-if="matches.length">
        <div class="flex items-center justify-center">
            <h1 class="text-5xl font-bold leading-tight">
                {{ teamInfo.shortName }}
            </h1>
            <img
                :src="teamInfo.crestUrl"
                :alt="teamInfo.shortName"
                class="w-12 mx-4"
            />
        </div>
        <Navbar
            :fixtures="fixtures"
            :results="results"
            @matches="matches = $event"
        />
        <div v-for="match in matches" :key="match.utcdate" ref="matchesref">
            <Match :area="teamInfo.area.name" :result-info="match" />
        </div>
    </div>
    <div v-else class="relative">
        <div class="min-w-full h-96 bg-gray-300 p-8 my-2 skeleton"></div>
        <SkeletonResults v-for="(load, i) in loading" :key="i" />
    </div>
</template>

<script>
const getTeams = () => import(`~/assets/teams.json`).then(t => t.default || t);
export default {
    data() {
        return {
            matches: [],
            fixtures: [],
            results: [],
            loading: [1, 1, 1]
        };
    },
    async asyncData({ route, error }) {
        const teams = await getTeams();
        const teamId = route.params.team;
        const teamInfo = teams.find(t => t.id == teamId);
        return {
            teamInfo
        };
    },
    async mounted() {
        const teamId = this.$route.params.team;
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getLatestResults&id=${teamId}`
        );
        const data = await response.json();
        const fixtures = data?.filter(m => m.status === "SCHEDULED");
        console.log("fixtures: ", fixtures);
        const results = data?.filter(m => m.status === "FINISHED");
        this.results = results.slice().reverse();
        this.matches = this.results.slice(0, 10);
        this.fixtures = fixtures;
    }
};
</script>
