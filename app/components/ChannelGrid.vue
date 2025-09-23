<template>
    <div class="mt-2 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
        <!-- Card -->
        <button v-for="c in items" :key="c.id" type="button" @click="go(String(c.id))"
            class="group text-left cursor-pointer">
            <div class="relative h-[220px] w-[280px] p-6 rounded-2xl shadow-sm
               bg-slate-800 border border-white/10 hover:shadow-lg hover:-translate-y-0.5 transition">
                <h2 class="mb-2 pr-10 text-2xl font-bold text-white line-clamp-1">
                    {{ c.title }}
                </h2>

                <p class="text-xs text-gray-300">
                    วันที่สร้าง: {{ c.created_at || '-' }}
                </p>

                <p class="mt-2 text-sm text-gray-300 line-clamp-2 min-h-[2.5rem]">
                    {{ c.description || '—' }}
                </p>

                <div class="mt-4">
                    <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                        :class="statusClass(c.status)">
                        {{ c.status || '—' }}
                    </span>
                </div>
            </div>
        </button>

        <!-- Empty -->
        <div v-if="!items || items.length === 0" class="col-span-full px-4 py-10 text-center text-gray-400">
            ไม่พบรายการ
        </div>
    </div>
</template>

<script setup lang="ts">
type ChannelCard = {
    id: string | number
    title: string
    description?: string | null
    created_at?: string | null
    status?: string | null
}

const props = defineProps<{ items: ChannelCard[] }>()

const go = (id: string) => navigateTo(`/chat?id=${encodeURIComponent(id)}`)

const statusClass = (s?: string | null) => {
    const v = (s || '').toLowerCase()
    if (v === 'public') return 'bg-emerald-600 text-white'
    if (v === 'private') return 'bg-slate-600 text-white'
    if (v === 'inactive') return 'bg-red-600 text-white'
    return 'bg-gray-600 text-white'
}
</script>
