<template>
    <div class="flex flex-wrap justify-center bg-blue-700">
        <div
            v-for="{ id, name, logo } in leagues"
            :key="id"
            class="w-full sm:w-48 bg-blue-300 p-2 pb-0 mx-8 my-4 sm:m-2 sm:m-10 self-center justify-self-center"
        >
            <nuxt-link :to="`/l/${id}`">
                <img :src="logo" :alt="name" class="h-32 w-48 p-2 mx-auto" />
            </nuxt-link>
            <ul class="mb-0 list-none">
                <nuxt-link :to="`/l/${id}`">
                    <li
                        class="text-center text-red-700 bg-white -mx-2 py-2 text-lg uppercase"
                    >
                        Results
                    </li>
                </nuxt-link>
                <nuxt-link :to="`/l/${id}/table`">
                    <li
                        class="text-center text-white bg-red-700 -mx-2 py-2 text-lg uppercase"
                    >
                        Table
                    </li>
                </nuxt-link>
            </ul>
        </div>
    </div>
</template>

<script>
import { leagues } from "../constants/constants";
export default {
    async asyncData() {
        return {
            leagues
        };
    }
};
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/

body {
    font-family: "Quicksand", "Source Sans Pro", -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
        sans-serif;
}

.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}

.links {
    padding-top: 15px;
}
</style>
