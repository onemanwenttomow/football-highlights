<template>
    <div>
        <h1>Standings</h1>
        <div class="bg-blue-700 text-white">
            <div class="flex">
                <div class="ml-2">Club</div>
            </div>
            <div
                v-for="{ position, team, shortName } in table"
                :key="position"
                class="h-10 flex"
            >
                <div class="flex items-center w-64">
                    <div class="inline-block text-center ml-2">
                        {{ position }}.
                    </div>
                    <div class="w-10">
                        <img :src="team.crestUrl" class="h-6 m-auto" />
                    </div>
                    <h4 class="inline inline-block">{{ shortName }}</h4>
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
        const leagueId = this.$route.params.league;
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getLeagueStandings&id=${leagueId}`
        );
        const data = await response.json();
        let table = data?.standings[0].table.map(row => {
            console.log("this.teamInfo: ", this.teams);
            console.log(
                "this.teams.find(t => t.id == row.team.id).nickName: ",
                this.teams.find(t => t.id == row.team.id)
            );
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
