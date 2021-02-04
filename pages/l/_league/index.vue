<template>
    <div>
        <!-- <div class="grid grid-cols-3 gap-4">
            <div v-for="team in teams" :key="team.id" class="place-self-center">
                <nuxt-link :to="'/t/' + team.id" no-prefetch>
                    <img
                        :src="team.crestUrl"
                        alt="team.shortName"
                        class="w-20"
                    />
                </nuxt-link>
            </div>
        </div> -->
        <div v-for="result in latestResults" :key="result.utcdate">
            <Result
                :area="country"
                :result-info="result"
                :competition-name="competition"
            />
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
