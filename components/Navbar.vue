<template>
    <ul class="sticky top-0 z-10 flex mb-0 list-none flex-wrap flex-row justify-center">
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
        <li class="flex-auto text-center" v-if="$route.params.league">
            <a
                class="uppercase px-5 py-3 block leading-normal text-red-700 bg-white "
                @click="$router.push({ path: `${$route.params.league}/table` })"
                :class="{
                    'text-red-700 bg-white': openTab !== 3,
                    'text-white bg-red-700': openTab === 3
                }"
            >
                Table
            </a>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        fixtures: {
            type: Array
        },
        results: {
            type: Array
        }
    },
    data() {
        return {
            openTab: 1,
            fixturesInView: 10,
            resultsInView: 10,
            currentlyViewing: "results",
            currentTarget: "",
            observer: ""
        };
    },

    async mounted() {
        this.addObserver();
    },
    watch: {
        async fixtures() {
            await this.$nextTick();
            this.addObserver();
        }
    },
    methods: {
        async switchTab(num) {
            this.currentTarget && this.observer.unobserve(this.currentTarget);
            this.openTab = num;
            if (num === 1) {
                this.fixturesInView = 10;
                this.$emit("matches", this.results.slice(0, 10));
                this.currentlyViewing = "results";
            }
            if (num === 2) {
                this.resultsInView = 10;
                this.$emit("matches", this.fixtures.slice(0, 10));
                this.currentlyViewing = "fixtures";
            }
            await this.$nextTick();
            this.addObserver();
        },
        loadNewFixtures() {
            console.log("loading more fixtures");
            this.fixturesInView += 10;
            this.$emit("matches", this.fixtures.slice(0, this.fixturesInView));
        },
        loadNewResults() {
            console.log("loading more results");
            this.resultsInView += 10;
            this.$emit("matches", this.results.slice(0, this.resultsInView));
        },
        handleIntersection(entries) {
            entries.map(entry => {
                if (!entry.isIntersecting) {
                    return;
                }
                if (this.currentlyViewing === "results") {
                    this.loadNewResults();
                }
                if (this.currentlyViewing === "fixtures") {
                    this.loadNewFixtures();
                }
                this.observer.unobserve(this.currentTarget);
                this.$nextTick().then(this.addObserver);
            });
        },
        addObserver() {
            const results = this.$parent.$refs.matchesref;
            if (!results || !results.length) {
                return;
            }
            const target = results[results.length - 1];
            this.currentTarget = target;
            const options = {
                threshold: 0.75
            };
            const handleIntersection = this.handleIntersection;
            const observer = new IntersectionObserver(
                handleIntersection,
                options
            );
            this.observer = observer;
            this.currentTarget = target;
            observer.observe(target);
        }
    }
};
</script>
