<template>
    <div>
        <h1>Standing</h1>
        <div class="flex justify-center">
            <div class="bg-blue-700 text-white p-2">
                <div class="flex pb-1 mb-1 border-b-2">
                    <div class="w-48">Club</div>
                    <div class="w-10 text-center">Pl</div>
                    <div class="w-10 text-center">GD</div>
                    <div class="w-10 text-center">Pts</div>
                </div>
                <div
                    v-for="{
                        position,
                        team,
                        shortName,
                        points,
                        playedGames,
                        goalDifference
                    } in table"
                    :key="position"
                    class="h-10 flex"
                >
                    <div class="flex items-center w-48">
                        <div class="inline-block text-center w-6">
                            {{ position }}.
                        </div>
                        <div class="w-10">
                            <img :src="team.crestUrl" class="h-6 m-auto" />
                        </div>
                        <h4 class="inline inline-block">{{ shortName }}</h4>
                    </div>
                    <div class="w-10 text-center">{{ playedGames }}</div>
                    <div class="w-10 text-center">
                        {{ goalDifference }}
                    </div>
                    <div class="w-10 text-center">{{ points }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const getTeams = () => import(`~/assets/teams.json`).then(t => t.default || t);

export default {
    data() {
        return {
            table: []
        };
    },
    async asyncData({ route, error }) {
        const teams = await getTeams();
        return {
            teams
        };
    },
    async mounted() {
        console.log("this.$route: ", this.$route);
        const leagueId = this.$route.params.league;
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getLeagueStandings&id=${leagueId}`
        );
        const data = await response.json();
        let table = data?.standings[0].table.map(row => {
            return {
                ...row,
                shortName: this.teams.find(t => t.id == row.team.id).shortName
            };
        });
        console.log("data: ", data?.standings[0].table);
        this.table = table;
    }
};
</script>
