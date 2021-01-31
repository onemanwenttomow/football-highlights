<template>
    <div>
        <div class="crest-container">
            <div v-for="team in teams" :key="team.id">
                <nuxt-link :to="'/t/' + team.id" no-prefetch>
                    <img :src="team.crestUrl" alt="team.shortName" class="crest">
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // async asyncData({ route, error, $footballApi }) {
    //     const leagueId = route.params.league;
    //     console.log('leagueId: ',leagueId);
    //     const teams = await $footballApi.getTeamsByLeague(leagueId);
    //     // put teams in local storage and check that first....
    //     // or add caching to footballApi
    //     console.log('teams: ',teams);
    //     return {
    //         teams
    //     };
    // },
    data() {
        return {
            teams: []
        }
    },
    async mounted() {
        const leagueId = route.params.league;
        console.log('leagueId: ',leagueId);
        const teams = await $footballApi.getTeamsByLeague(leagueId);
        // put teams in local storage and check that first....
        // or add caching to footballApi
        console.log('teams: ',teams);
        this.teams = teams;
        // return {
        //     teams
        // };
    }
};
</script>

<style>

.crest-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.crest {
    padding: 10px;
    height: 100px;
    width: 100px;
}

</style>