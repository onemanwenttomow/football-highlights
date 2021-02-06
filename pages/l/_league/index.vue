<template>
    <div>
        <ul class="flex mb-0 list-none flex-wrap pt-3 flex-row justify-center">
            <li class="flex-auto text-center">
                <a
                    class="uppercase px-5 py-3 block leading-normal"
                    @click="switchTab(1)"
                    :class="{
                        'text-red-700 bg-white': openTab !== 1,
                        'text-white bg-red-700': openTab === 1
                    }"
                >
                    Results
                </a>
            </li>
            <li class="flex-auto text-center">
                <a
                    class="uppercase px-5 py-3 block leading-normal"
                    @click="switchTab(2)"
                    :class="{
                        'text-red-700 bg-white': openTab !== 2,
                        'text-white bg-red-700': openTab === 2
                    }"
                >
                    Fixtures
                </a>
            </li>
        </ul>
        <div v-if="matches.length">
            <div v-for="match in matches" :key="match.utcdate" ref="matches">
                <Result
                    :area="country"
                    :result-info="match"
                    :competition-name="competition"
                />
            </div>
        </div>
        <div v-else class="relative">
            <SkeletonResults v-for="(load, i) in loading" :key="i" />
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
            matches: [],
            fixtures: [],
            results: [],
            loading: [1, 1, 1],
            country: "",
            competition: "",
            openTab: 1,
            fixturesInView: 10,
            resultsInView: 10,
            currentlyViewing: "results",
            observer: "",
            target: ""
        };
    },
    methods: {
        switchTab(num) {
            this.observer.unobserve(this.target);
            this.openTab = num;
            console.log("this.matches.length: ", this.matches.length);
            if (num === 1) {
                this.matches = this.results.slice(0, 10);
                this.currentlyViewing = "results";
            }
            if (num === 2) {
                this.matches = this.fixtures.slice(0, 10);
                this.currentlyViewing = "fixtures";
            }
            setTimeout(() => {
                this.addObserver();
            }, 1);
        },
        addObserver() {
            console.log("this.$refs.matches: ", this.$refs.matches);
            const matches = this.$refs.matches;
            if (!matches.length) {
                return;
            }
            const target = matches[matches.length - 1];
            const options = {
                threshold: 0.75
            };
            const handleIntersection = entries => {
                entries.map(entry => {
                    console.log("do something!");
                    if (entry.isIntersecting) {
                        console.log(
                            "this.currentlyViewing: ",
                            this.currentlyViewing
                        );
                        if (this.currentlyViewing === "results") {
                            this.resultsInView += 10;
                            this.matches = this.results.slice(
                                0,
                                this.resultsInView
                            );
                        }
                        if (this.currentlyViewing === "fixtures") {
                            this.fixturesInView += 10;
                            this.matches = this.fixtures.slice(
                                0,
                                this.fixturesInView
                            );
                        }
                        observer.unobserve(target);
                        this.addObserver();
                    }
                });
            };
            const observer = new IntersectionObserver(
                handleIntersection,
                options
            );
            this.observer = observer;
            this.target = target;

            observer.observe(target);
        }
    },
    async mounted() {
        const leagueId = this.$route.params.league;
        const response = await fetch(
            `/.netlify/functions/football-data?perform=getResultsByLeage&id=${leagueId}`
        );
        const data = await response.json();
        const fixtures = data?.matches.filter(m => m.status === "SCHEDULED");
        const results = data?.matches.filter(m => m.status === "FINISHED");
        this.results = results.slice().reverse();
        this.matches = this.results.slice(0, 10);
        this.fixtures = fixtures;
        this.country = data?.competition?.area?.name;
        this.competition = data?.competition?.name;
        setTimeout(() => {
            this.addObserver();
        }, 1);
        // need to limit how many matches are on screen at any time...
    }
};
</script>
