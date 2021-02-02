<template>
    <div>
        <div class="grid grid-cols-3 gap-4">
            <div v-for="team in teams" :key="team.id" class="place-self-center">
                <nuxt-link :to="'/t/' + team.id" no-prefetch>
                    <img
                        :src="team.crestUrl"
                        alt="team.shortName"
                        class="w-20"
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
        const data = await import(`~/assets/${leagueId}.json`);
        return {
            teams: data.default
        };
    }
};
</script>
