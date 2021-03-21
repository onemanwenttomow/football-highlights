<template>
    <div class="bg-blue-200 min-h-screen">
        <div class="max-w-screen-sm m-auto">
            <Logo />
            <Breadcrumbs />
            <Nuxt />
        </div>
    </div>
</template>

<style>
html {
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
}

/* maybe witch to using animate-pulse */

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
