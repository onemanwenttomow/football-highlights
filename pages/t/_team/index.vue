<template>
    <div>
        <h1>Hello {{ teamInfo.shortName}}</h1>
        <img :src="teamInfo.crestUrl" :alt="teamInfo.shortName">
        <h2>Last 5 results</h2>
        <div v-for="result in latestResults" :key="result.id">
            <Result 
                :home-team="result.homeTeam.name"
                :away-team="result.awayTeam.name"
                :home-score="result.score.fullTime.homeTeam"
                :away-score="result.score.fullTime.awayTeam"
                :competition="result.competition.name"
                :date="result.utcDate"
            />
        </div>
    </div>
</template>


<script>
export default {
    // async asyncData({ route, error, $footballApi }) {
    //     const teamId = route.params.team;
    //     const [teamInfo, latestResults] = await Promise.all([
    //         $footballApi.getTeamById(teamId),
    //         $footballApi.getLastFiveResultsByTeam(teamId)
    //     ])
    //     // put teams in local storage and check that first....
    //     // or some other kind of caching...
    //     console.log('latestResults: ',latestResults);
    //     // console.log('teamInfo: ',teamInfo);
    //     return {
    //         latestResults: latestResults.reverse(),
    //         teamInfo
    //     };
    // },
    data() {
        return {
            teamInfo: {},
            latestResults: []
        }
    },
    async mounted() {
        const teamId = this.$route.params.team;
        const [teamInfo, latestResults] = await Promise.all([
            this.$footballApi.getTeamById(teamId),
            this.$footballApi.getLastFiveResultsByTeam(teamId)
        ])
        // put teams in local storage and check that first....
        // or some other kind of caching...
        console.log('latestResults: ',latestResults);
        // console.log('teamInfo: ',teamInfo);
        this.latestResults = latestResults?.reverse();
        this.teamInfo = teamInfo
        // return {
        //     latestResults: latestResults.reverse(),
        //     teamInfo
        // };
    }
};
</script>