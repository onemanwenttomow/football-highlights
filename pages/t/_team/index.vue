<template>
    <div v-if="latestResults.length">
        <div class="flex items-center justify-center">
            <h1 class="text-5xl font-bold leading-tight">
                {{ teamInfo.shortName }}
            </h1>
            <img
                :src="teamInfo && teamInfo.crestUrl"
                :alt="teamInfo.shortName"
                class="w-12 mx-4"
            />
        </div>
        <div v-for="result in latestResults" :key="result.utcdate">
            <Result :area="teamInfo.area.name" :result-info="result" />
        </div>
    </div>
    <div v-else>
        <div class="min-w-full h-96 bg-gray-300 p-8 my-2"></div>
        <div
            v-for="(load, i) in loading"
            :key="i"
            class="min-w-full bg-gray-300 my-6 px-4 text-4xl text-gray-400 relative skeleton"
        >
            <div class="bg-red-300 w-1/4 m-auto h-8 mb-8"></div>
            <div>
                <div class="h-12 w-12 mr-2 bg-gray-400 inline-block"></div>
                <div class="h-12 w-12 mr-2 bg-gray-400 inline-block"></div>
            </div>
            <div class="flex justify-between mt-2">
                <div class="bg-gray-400">team name</div>
                <div class="py-1 px-5 bg-red-300 text-red-300">
                    0
                </div>
            </div>
            <div class="flex justify-between mt-2">
                <div class="bg-gray-400">team name</div>
                <div class="py-1 px-5 bg-red-300 text-red-300">
                    0
                </div>
            </div>
            <div class="flex flex-col justify-center">
                <div class="bg-gray-400 px-4 py-2 mt-8 mb-4 text-xl">
                    button text
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
            teamInfo: {},
            latestResults: [],
            loading: [1, 1, 1]
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

<style>
.skeleton::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.2) 20%,
        rgba(255, 255, 255, 0.5) 60%,
        rgba(255, 255, 255, 0)
    );
    content: "";
}

.skeleton:nth-child(even):after {
    animation: shimmer 3s infinite;
}

.skeleton:nth-child(odd):after {
    animation: shimmer 3s 1s infinite;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>
