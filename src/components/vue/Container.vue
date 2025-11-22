<template>
    <p>{{message}}</p>
    <p class="text-blue-500">Stay updated on the latest developments and projects by bookmarking this page. You can navigate through different sections using the menu above.</p>
</template>

<script setup>
    import { ref } from 'vue';

    const message = ref('Bookmark this page to stay informed about the latest updates and developments on my projects.');
</script>

<style scoped>
    p {
        font-size:bold;
    }
</style>
