<template>
    <div v-if="isFixture" class="flex flex-col justify-center">
        <button
            class="bg-white text-blue-800 px-4 py-2 mt-8 font-bold uppercase"
            @click="getHighlights"
            :disabled="btnDisabled"
        >
            {{ btnText }}
        </button>
        <div
            class="m-auto mt-4 hightlights-container flex"
            :class="resultsSlider ? 'height' : ''"
        >
            <div class="min-height"></div>
            <a
                v-if="highlights.length"
                :href="`https://www.youtube.com/watch?v=${highlights[0].id}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex justify-center items-center"
            >
                <img
                    src="/youtube-play.svg"
                    alt="play button"
                    class="h-24 absolute left-1/2 opacity-0"
                    v-if="showYouTubeIcon"
                    :class="showYouTubeIcon && 'bounce'"
                />
                <img
                    :src="
                        `https://img.youtube.com/vi/${highlights[0].id}/0.jpg`
                    "
                    @load="imageLoaded"
                    v-if="showImage"
                />
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isFixture: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        query: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            highlights: [],
            btnText: "Check for Highlights",
            btnDisabled: false,
            showYouTubeIcon: false,
            showImage: false,
            resultsSlider: false
        };
    },
    computed: {
        fetchUrl() {
            const country = this.country.toLowerCase();
            const date = this.date;
            return `/.netlify/functions/youtube-data?date=${date}&q=${this.query}&country=${country}`;
        }
    },
    methods: {
        slideInImagePreview() {
            this.resultsSlider = true;
            setTimeout(() => (this.showImage = true), 600);
        },
        imageLoaded() {
            setTimeout(() => (this.showYouTubeIcon = true), 300);
        },
        async getHighlights() {
            this.btnText = "checking....";
            this.btnDisabled = true;
            const url = this.fetchUrl;
            const response = await fetch(url);
            const results = await response.json();
            results.length ? this.showHighlights(results) : this.noHighlights();
        },
        showHighlights(results) {
            this.btnText = "Highlights below";
            this.highlights = results;
            this.slideInImagePreview();
        },
        noHighlights() {
            this.btnText = "Sorry, no highlights yet";
        }
    }
};
</script>

<style>
.hightlights-container {
    max-height: 0px;
    transition: 0.3s all ease-in;
}

.no-height {
    max-height: 0px;
}

.height {
    max-height: 350px;
}

.min-height {
    min-height: 350px;
}

.bounce {
    animation: bounce-in 0.5s ease-in 0.1s 1 normal forwards;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
