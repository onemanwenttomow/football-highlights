<template>
    <div class="container">
        <div v-for="{ id, name } in leagues" :key="id">
            <nuxt-link :to="`/l/${id}`">{{ name }}</nuxt-link>
            <br>
            <nuxt-link :to="`/l/${id}`">{{ name }} Table</nuxt-link>
        </div>
    </div>
</template>

<script>
import { leagues } from "../constants/constants";
export default {
    async asyncData() {
        console.log("leagues: ", leagues);
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
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

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
