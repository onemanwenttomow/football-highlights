<template>
    <div v-if="latestResults.length">
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
        <div v-for="result in latestResults" :key="result.utcdate">
            <Result :area="teamInfo.area.name" :result-info="result" />
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
            latestResults: [],
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
        const latestResults = await response.json();
        console.log("latestResults: ", latestResults);
        this.latestResults = latestResults?.reverse();
    }
};
</script>
