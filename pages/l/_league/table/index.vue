<template>
    <div>
        <h1>Standings</h1>
        <div class="bg-blue-700 text-white">
            <div
                v-for="{ position, team } in table"
                :key="position"
                class="h-10 flex align-center"
            >
                <div class="">
                    <div class="inline-block w-6 text-center">
                        {{ position }}.
                    </div>
                    <div class="w-6 inline-flex">
                        <img :src="team.crestUrl" class="h-6" />
                    </div>
                    <h4 class="inline inline-block">{{ team.name }}</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            table: []
        };
    },
    async mounted() {
        const leagueId = this.$route.params.league;
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getLeagueStandings&id=${leagueId}`
        );
        const data = await response.json();
        console.log("data: ", data?.standings[0].table);
        this.table = data?.standings[0].table;
    }
};
</script>
