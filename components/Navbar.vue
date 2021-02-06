<template>
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
</template>

<script>
export default {
    props: {
        fixtures: {
            type: Array,
            required: true
        },
        results: {
            type: Array,
            required: true
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
    watch: {
        async fixtures() {
            await this.$nextTick();
            this.addObserver();
        }
    },
    methods: {
        async switchTab(num) {
            this.observer.unobserve(this.currentTarget);
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
        handleIntersection(entries) {
            entries.map(entry => {
                console.log("do something!");
                if (entry.isIntersecting) {
                    if (this.currentlyViewing === "results") {
                        this.resultsInView += 10;
                        this.$emit(
                            "matches",
                            this.results.slice(0, this.resultsInView)
                        );
                    }
                    if (this.currentlyViewing === "fixtures") {
                        this.fixturesInView += 10;
                        this.$emit(
                            "matches",
                            this.fixtures.slice(0, this.fixturesInView)
                        );
                    }
                    this.observer.unobserve(this.currentTarget);
                    setTimeout(this.addObserver, 1);
                }
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
