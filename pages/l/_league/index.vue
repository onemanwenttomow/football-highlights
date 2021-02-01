<template>
    <div>
        <div class="crest-container">
            <div v-for="team in teams" :key="team.id">
                <nuxt-link :to="'/t/' + team.id" no-prefetch>
                    <img
                        :src="team.crestUrl"
                        alt="team.shortName"
                        class="crest"
                    />
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ route, error }) {
        const leagueId = route.params.league;
        const data = await import(`../../../assets/${leagueId}.json`);
        return {
            teams: data.default
        };
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
