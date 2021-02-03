<template>
    <div class="container">
        <nuxt-link to="/l/2021">Premier League</nuxt-link>
        <nuxt-link to="/l/2002">Bundesliga </nuxt-link>
        <nuxt-link to="/l/2014">La Liga</nuxt-link>
        <nuxt-link to="/l/2019">Serie A</nuxt-link>
    </div>
</template>

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
