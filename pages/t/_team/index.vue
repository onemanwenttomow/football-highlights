<template>
    <div>
        <div class="flex items-center justify-center">
            <h1 class="text-5xl font-bold leading-tight">
                {{ teamInfo.shortName }}
            </h1>
            <img
                :src="teamInfo && teamInfo.crestUrl"
                :alt="teamInfo.shortName"
                class="h-12 w-12 mx-4"
            />
        </div>
        <div v-for="result in latestResults" :key="result.utcdate">
            <Result :area="teamInfo.area.name" :result-info="result" />
        </div>
    </div>
</template>

<script>
const getTeams = () => import(`~/assets/teams.json`).then(t => t.default || t);
export default {
    data() {
        return {
            teamInfo: {},
            latestResults: []
        };
    },
    async mounted() {
        const teams = await getTeams();
        const teamId = this.$route.params.team;
        const teamInfo = teams.find(t => t.id == teamId);
        console.log("teamInfo: ", teamInfo);
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getLatestResults&id=${teamId}`
        );
        const latestResults = await response.json();
        console.log("latestResults: ", latestResults);
        this.latestResults = latestResults?.reverse();
        this.teamInfo = teamInfo;
    }
};
</script>
