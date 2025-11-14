<template>
    <div class="bg-[var(--bg)] text-[var(--fg)] min-h-screen px-50">
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
const { loadTheme } = useTheme();

onMounted(() => {
    loadTheme();
});
</script>
