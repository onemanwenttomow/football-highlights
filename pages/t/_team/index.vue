<template>
    <div>
        <h1>Hello {{ teamInfo.shortName }}</h1>
        <img :src="teamInfo.crestUrl" :alt="teamInfo.shortName" />
        <h2>Last 5 results</h2>
        <div v-for="result in latestResults" :key="result.id">
            <Result
                :home-team="result.homeTeam.name"
                :away-team="result.awayTeam.name"
                :home-score="result.score.fullTime.homeTeam"
                :away-score="result.score.fullTime.awayTeam"
                :competition="result.competition.name"
                :date="result.utcDate"
                :area="teamInfo.area.name"
                :result-info="result"
            />
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
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getLastFiveResultsByTeam&id=${teamId}`
        );
        const latestResults = await response.json();
        console.log("latestResults: ", latestResults);
        this.latestResults = latestResults?.reverse();
        this.teamInfo = teamInfo;
    }
};
</script>
