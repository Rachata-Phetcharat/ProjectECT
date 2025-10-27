<template>
    <div class="px-6 pt-6">
        <!-- ใช้ CSS Grid ให้การ์ดเรียงตัวสวยและยืดหยุ่น -->
        <div ref="rootEl" class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            <!-- Add card -->
            <button v-if="showAddCard" type="button" class="group h-[220px] w-full flex flex-col items-center justify-center rounded-2xl
               border-2 border-dashed border-[var(--card-border)]
               bg-[var(--card)] text-[var(--muted)]
               hover:text-[var(--fg)] hover:brightness-95 transition cursor-pointer" @click="$emit('add')"
                aria-label="สร้างแชนแนลใหม่">
                <div class="flex items-center gap-2">
                    <Icon name="line-md:plus" class="h-6 w-6" />
                    <span class="font-medium">สร้างแชนแนลใหม่</span>
                </div>
            </button>

            <!-- CHANNEL CARDS (ทั้งใบเป็นลิงก์) -->
            <NuxtLink v-for="c in items" :key="c.id" :to="linkTo(c.id)" :title="`เปิดแชนแนล: ${c.title || c.id}`" class="relative h-[220px] w-full rounded-2xl
               border border-[var(--card-border)] bg-[var(--card)]
               p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                @click="$emit('click', String(c.id))">
                <!-- 3-dots menu button -->
                <button v-if="canEdit" type="button" aria-label="เมนู" @click.stop.prevent="toggleMenu(c.id)" class="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center
                 rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted)]
                 hover:text-[var(--fg)] hover:brightness-95
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                    <Icon name="lucide:more-vertical" class="h-5 w-5" />
                </button>

                <!-- dropdown -->
                <div v-if="openMenuId === c.id" role="menu" class="absolute right-3 top-12 z-20 w-44 rounded-lg border border-[var(--card-border)]
                 bg-[var(--card)] text-[var(--fg)] shadow-lg overflow-hidden" @click.stop>
                    <button class="block w-full px-4 py-2 text-left text-sm hover:bg-black/5 cursor-pointer"
                        @click.stop.prevent="openDetail(c)" role="menuitem">
                        รายละเอียด
                    </button>
                    <button v-if="canEdit"
                        class="block w-full px-4 py-2 text-left text-sm hover:bg-black/5 cursor-pointer"
                        @click.stop.prevent="onEdit(c)" role="menuitem">
                        แก้ไข
                    </button>
                    <button v-if="canEdit"
                        class="block w-full px-4 py-2 text-left text-sm text-rose-700 hover:bg-black/5 cursor-pointer"
                        @click.stop.prevent="onDelete(c)" role="menuitem">
                        ลบ
                    </button>
                </div>

                <!-- เนื้อการ์ด -->
                <div class="pr-2 pointer-events-none">
                    <h3 class="mb-1 line-clamp-1 text-xl font-bold text-[var(--fg)]">
                        {{ c.title }}
                    </h3>

                    <p class="text-xs text-[var(--muted)]">
                        วันที่สร้าง: {{ c.created_at || '-' }}
                    </p>

                    <p v-if="c.created_by" class="mt-1 text-xs text-[var(--muted)] line-clamp-1">
                        โดย: {{ c.created_by }}
                    </p>

                    <div class="mt-3">
                        <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold border"
                            :class="badgeClass(c.status)">
                            {{ c.status || '—' }}
                        </span>
                    </div>
                </div>

                <!-- ปุ่มรายละเอียดด้านล่าง (กันนำทาง) -->
                <div class="absolute inset-x-5 bottom-4 flex gap-2">
                    <button type="button" class="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold
                   border border-[var(--card-border)] bg-[var(--card)] text-[var(--fg)]
                   hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                        @click.stop.prevent="openDetail(c)">
                        รายละเอียด
                    </button>
                </div>
            </NuxtLink>

            <!-- Empty -->
            <div v-if="!loading && (!items || items.length === 0)"
                class="col-span-full px-4 py-10 text-center text-[var(--muted)]">
                ไม่พบรายการ
            </div>

            <!-- Loading skeleton -->
            <template v-if="loading">
                <div v-for="i in skeletonCount" :key="i"
                    class="h-[220px] w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 animate-pulse">
                    <div class="h-4 w-3/5 bg-black/10 rounded mb-3"></div>
                    <div class="h-3 w-2/5 bg-black/10 rounded mb-4"></div>
                    <div class="h-6 w-20 bg-black/10 rounded mb-4"></div>
                    <div class="h-16 w-full bg-black/10 rounded"></div>
                </div>
            </template>
        </div>
    </div>

    <!-- Modal: Details -->
    <div v-if="detailModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="detailModal.open = false">
        <div class="w-full max-w-lg rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg p-5">
            <div class="flex justify-between items-center mb-3">
                <div class="text-xl font-semibold">รายละเอียดแชนแนล</div>
                <button class="cursor-pointer text-[var(--muted)] hover:text-[var(--fg)]"
                    @click="detailModal.open = false">
                    <Icon name="line-md:close" class="w-6 h-6" />
                </button>
            </div>

            <div class="space-y-2 text-sm">
                <div>
                    <span class="text-[var(--muted)]">ชื่อ:</span>
                    {{ detailModal.data?.title || '-' }}
                </div>
                <div>
                    <span class="text-[var(--muted)]">คำอธิบาย:</span>
                    {{ detailModal.data?.description || '-' }}
                </div>
                <div>
                    <span class="text-[var(--muted)]">สถานะ:</span>
                    {{ detailModal.data?.status || '—' }}
                </div>
                <div>
                    <span class="text-[var(--muted)]">วันที่สร้าง:</span>
                    {{ detailModal.data?.created_at || '—' }}
                </div>
                <div v-if="detailModal.data?.created_by">
                    <span class="text-[var(--muted)]">ผู้สร้าง:</span>
                    {{ detailModal.data?.created_by }}
                </div>
            </div>

            <div class="mt-4 text-right">
                <button class="rounded-lg px-4 py-2 border border-[var(--card-border)] bg-[var(--card)] hover:brightness-95 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" @click="detailModal.open = false">
                    ปิด
                </button>
            </div>
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
    created_by?: string | null
}

const props = defineProps<{
    items: ChannelCard[]
    loading?: boolean
    showAddCard?: boolean
    canEdit?: boolean
    skeletonCount?: number
    toBase?: string // พาธฐานสำหรับไปหน้าแชท (ดีฟอลต์: /chat?id=xxx)
}>()

const emit = defineEmits<{
    (e: 'add'): void
    (e: 'click', id: string): void
    (e: 'detail', item: ChannelCard): void
    (e: 'edit', item: ChannelCard): void
    (e: 'delete', item: ChannelCard): void
}>()

const showAddCard = computed(() => props.showAddCard ?? false)
const canEdit = computed(() => props.canEdit ?? false)
const loading = computed(() => props.loading ?? false)
const skeletonCount = computed(() => props.skeletonCount ?? 6)

const linkTo = (id: string | number) => {
    const base = props.toBase || '/chat'
    return base.includes('?')
        ? `${base}&id=${encodeURIComponent(String(id))}`
        : `${base}?id=${encodeURIComponent(String(id))}`
}

/* ===== dropdown ===== */
const openMenuId = ref<string | number | null>(null)
const toggleMenu = (id: string | number) => {
    openMenuId.value = openMenuId.value === id ? null : id
}

/* ===== modal: details ===== */
const detailModal = reactive({
    open: false,
    data: null as ChannelCard | null,
})
const openDetail = (c: ChannelCard) => {
    openMenuId.value = null
    detailModal.data = c
    detailModal.open = true
    emit('detail', c)
}

/* ===== forward events ===== */
const onEdit = (c: ChannelCard) => {
    openMenuId.value = null
    emit('edit', c)
}
const onDelete = (c: ChannelCard) => {
    openMenuId.value = null
    emit('delete', c)
}

/* ===== outside click for dropdown ===== */
const rootEl = ref<HTMLElement | null>(null)
const handleOutsidePointer = (e: PointerEvent) => {
    if (!rootEl.value) return
    const target = e.target as Node
    if (!rootEl.value.contains(target)) {
        openMenuId.value = null
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleOutsidePointer, { passive: true })
})
onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleOutsidePointer)
})

/* ===== badge ===== */
const badgeClass = (status?: string | null) => {
    const s = (status || '').toLowerCase()
    if (s === 'public' || s === 'active') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (s === 'draft') return 'bg-amber-100 text-amber-800 border-amber-200'
    if (s === 'private' || s === 'inactive') return 'bg-rose-100 text-rose-700 border-rose-200'
    return 'bg-zinc-100 text-zinc-700 border-zinc-200'
}
</script>
