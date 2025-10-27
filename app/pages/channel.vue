<template>
    <!-- Top (App bar) -->
    <header class="border-b border-[var(--card-border)] bg-[var(--bg)]/90 backdrop-blur">
        <div class="mx-auto py-4 flex items-center justify-between text-[var(--fg)]">
            <div class="flex items-center gap-3">
                <!-- <div
                    class="w-9 h-9 grid place-items-center rounded-lg border border-[var(--card-border)] bg-[var(--bg)]">
                    <Icon name="lucide:hash" class="w-5 h-5" />
                </div> -->
                <div>
                    <h1 class="text-xl sm:text-2xl font-bold">จัดการแชนแนล</h1>
                    <p class="text-xs text-[var(--muted)] hidden sm:block">สร้าง/ค้นหา จัดระเบียบแชนแนลของคุณ</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <!-- สร้างแชนแนลใหม่: ใช้ state เปิด modal -->
                <button type="button" @click="createOpen = true" class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer
                 bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition">
                    <Icon name="line-md:plus-square" class="w-5 h-5" />
                    สร้างแชนแนลใหม่
                </button>

                <!-- เมนูผู้ใช้ สูงกว่า action bar เพื่อไม่โดนทับ -->
                <div class="relative z-[70]">
                    <UserMenu />
                </div>
            </div>
        </div>
    </header>

    <!-- Action bar (sticky under header) -->
    <div
        class="sticky top-[60px] sm:top-[68px] z-10 border-b border-[var(--card-border)] bg-[var(--bg)]/85 backdrop-blur">
        <div class="mx-auto py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <!-- Search -->
            <div class="relative w-full md:w-[28rem]">
                <Icon name="lucide:search"
                    class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input v-model="q" type="text" placeholder="ค้นหาแชนแนลของฉัน..." class="w-full rounded-lg pl-9 pr-3 py-2
                 bg-[var(--card)] text-[var(--fg)]
                 border border-[var(--card-border)]
                 placeholder:text-[var(--muted)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" />
            </div>

            <!-- Filters: เหลือ All/Public/Private -->
            <div class="flex items-center gap-2">
                <div class="text-xs text-[var(--muted)] hidden md:block">
                    {{ visible.length }} / {{ channels.length }} แชนแนล
                </div>
                <div class="inline-flex rounded-full border border-[var(--card-border)] bg-[var(--card)] p-1">
                    <button :class="pillClass(statusFilter === 'all')" @click="statusFilter = 'all'">ทั้งหมด</button>
                    <button :class="pillClass(statusFilter === 'public')"
                        @click="statusFilter = 'public'">Public</button>
                    <button :class="pillClass(statusFilter === 'private')"
                        @click="statusFilter = 'private'">Private</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Error -->
    <div v-if="pageErr" class="mx-auto pt-4">
        <div class="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-sm px-3 py-2">
            {{ pageErr }}
        </div>
    </div>

    <!-- List -->
    <main class="mx-auto pt-6 pb-12">
        <!-- Skeleton -->
        <div v-if="loading && !visible.length"
            class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <div v-for="i in 5" :key="i" class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
                <div class="animate-pulse space-y-3">
                    <div class="h-6 w-2/3 rounded bg-black/5"></div>
                    <div class="h-3 w-1/2 rounded bg-black/5"></div>
                    <div class="h-3 w-5/6 rounded bg-black/5"></div>
                    <div class="h-8 w-24 rounded-full bg-black/5 mt-4"></div>
                </div>
            </div>
        </div>

        <div v-else ref="cardsRoot"
            class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <!-- Add card -->
            <button type="button" @click="createOpen = true" class="group flex h-[240px] w-full flex-col items-center justify-center rounded-2xl
               border-2 border-dashed border-[var(--card-border)]
               bg-[var(--card)] text-[var(--muted)]
               hover:text-[var(--fg)] hover:brightness-95 transition cursor-pointer">
                <div class="flex items-center gap-2">
                    <Icon name="line-md:plus" class="h-6 w-6" />
                    <span class="font-medium">สร้างแชนแนลใหม่</span>
                </div>
            </button>

            <!-- CHANNEL CARDS (สมดุล: flex column + footer ด้านล่างเสมอ) -->
            <div v-for="ch in visible" :key="ch.id" @click="navigateTo(`/chat?id=${ch.id}`)" class="relative h-[240px] w-full cursor-pointer rounded-2xl
               border border-[var(--card-border)] bg-[var(--card)]
               p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition
               flex flex-col">
                <!-- 3-dots menu -->
                <button type="button" aria-label="เมนู" @click.stop="toggleMenu(ch.id)" class="absolute right-3 top-3 z-[60] inline-flex h-8 w-8 items-center justify-center
                 rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted)]
                 hover:text-[var(--fg)] hover:brightness-95
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                    <Icon name="lucide:more-vertical" class="h-5 w-5" />
                </button>

                <!-- dropdown -->
                <div v-if="openMenuId === ch.id" class="absolute right-3 top-12 z-[65] w-44 rounded-lg border border-[var(--card-border)]
                 bg-[var(--card)] text-[var(--fg)] shadow-lg overflow-hidden" @click.stop>
                    <button class="block w-full px-4 py-2 text-left text-sm hover:bg-black/5 cursor-pointer"
                        @click="openDetails(ch.id)">
                        รายละเอียด
                    </button>
                    <button class="block w-full px-4 py-2 text-left text-sm hover:bg-black/5 cursor-pointer"
                        @click="openEdit(ch)">
                        แก้ไข
                    </button>
                    <button
                        class="block w-full px-4 py-2 text-left text-sm text-rose-700 hover:bg-black/5 cursor-pointer"
                        @click="openDelete(ch)">
                        ลบ
                    </button>
                </div>

                <!-- เนื้อการ์ด -->
                <div class="pr-2">
                    <h3 class="line-clamp-1 text-lg font-bold">
                        {{ ch.title }}
                    </h3>
                    <p class="mt-1 text-xs text-[var(--muted)]">วันที่สร้าง: {{ ch.created_at || '-' }}</p>
                    <p class="mt-2 text-sm text-[var(--muted)] line-clamp-2">
                        {{ ch.description || '—' }}
                    </p>
                </div>

                <!-- Footer ของการ์ด (ชิดล่างเสมอ) -->
                <div class="mt-auto flex items-center justify-between pt-4">
                    <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold border"
                        :class="badgeClass(ch.status)">
                        {{ ch.status || '—' }}
                    </span>
                    <button type="button" @click.stop="openDetails(ch.id)" class="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold
                   border border-[var(--card-border)] bg-[var(--card)] text-[var(--fg)]
                   hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                        รายละเอียด
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div v-if="!loading && visible.length === 0" class="mt-10">
            <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-10 text-center">
                <Icon name="lucide:inbox" class="w-10 h-10 mx-auto opacity-60" />
                <p class="mt-3 text-sm text-[var(--muted)]">ยังไม่มีแชนแนลที่ตรงกับเงื่อนไข</p>
                <div class="mt-4">
                    <button type="button" @click="createOpen = true" class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer
                   bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110
                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition">
                        <Icon name="line-md:plus" class="w-5 h-5" /> สร้างแชนแนลแรกของคุณ
                    </button>
                </div>
            </div>
        </div>
    </main>

    <!-- Modal: Create Channel (ใช้ v-if + state) -->
    <div v-if="createOpen"
        class="fixed inset-0 z-[80] flex justify-center items-center w-full h-full backdrop-blur-sm bg-black/50"
        @click.self="createOpen = false">
        <div class="relative p-4 w-full max-w-md">
            <div class="relative rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg">
                <div class="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
                    <h3 class="text-lg font-semibold">สร้างแชนแนลใหม่</h3>
                    <button type="button"
                        class="text-[var(--muted)] hover:text-[var(--fg)] hover:bg-black/5 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer"
                        @click="createOpen = false">
                        <Icon name="line-md:close" class="w-5 h-5" />
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>

                <form class="p-5" @submit.prevent="createChannel">
                    <div class="grid gap-4 mb-4">
                        <div>
                            <label class="block mb-1 text-sm">ชื่อแชนแนล</label>
                            <input v-model="newCh.title" type="text" required class="w-full rounded-lg px-3 py-2
                       bg-[var(--card)] text-[var(--fg)]
                       border border-[var(--card-border)]
                       placeholder:text-[var(--muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" />
                        </div>
                        <div>
                            <label class="block mb-1 text-sm">คำอธิบาย</label>
                            <textarea v-model="newCh.description" rows="4" class="w-full rounded-lg px-3 py-2
                       bg-[var(--card)] text-[var(--fg)]
                       border border-[var(--card-border)]
                       placeholder:text-[var(--muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" />
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button type="submit" :disabled="creating" class="cursor-pointer inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium
                     bg-[var(--brand)] text-[var(--brand-contrast)]
                     hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
                     disabled:opacity-60">
                            {{ creating ? 'กำลังสร้าง…' : 'ตกลง' }}
                        </button>
                        <button type="button" @click="resetForm" class="cursor-pointer inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium
                     border border-[var(--card-border)] bg-[var(--card)] text-[var(--fg)]
                     hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                            ล้างค่า
                        </button>
                    </div>

                    <p v-if="errMsg" class="mt-3 text-sm text-rose-600">{{ errMsg }}</p>
                    <p v-if="okMsg" class="mt-3 text-sm text-emerald-600">{{ okMsg }}</p>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal: Details -->
    <div v-if="detailModal.open"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm"
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
                <div><span class="text-[var(--muted)]">ชื่อ:</span> {{ detailModal.data?.title || '-' }}</div>
                <div><span class="text-[var(--muted)]">คำอธิบาย:</span> {{ detailModal.data?.description || '-' }}</div>
                <div><span class="text-[var(--muted)]">สถานะ:</span> {{ detailModal.data?.status || '—' }}</div>
                <div><span class="text-[var(--muted)]">วันที่สร้าง:</span> {{ detailModal.data?.created_at || '—' }}
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

    <!-- Modal: Edit -->
    <div v-if="editModal.open"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="editModal.open = false">
        <div class="w-full max-w-md rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg p-5">
            <div class="flex justify-between items-center mb-3">
                <div class="text-xl font-semibold">แก้ไขแชนแนล</div>
                <button class="cursor-pointer text-[var(--muted)] hover:text-[var(--fg)]"
                    @click="editModal.open = false">
                    <Icon name="line-md:close" class="w-6 h-6" />
                </button>
            </div>

            <form @submit.prevent="submitEdit">
                <label class="text-sm">ชื่อแชนแนล</label>
                <input v-model="editModal.form.title" type="text" class="mt-1 mb-3 w-full rounded-lg px-3 py-2
                 bg-[var(--card)] text-[var(--fg)]
                 border border-[var(--card-border)]
                 placeholder:text-[var(--muted)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" required />

                <label class="text-sm">คำอธิบาย</label>
                <textarea v-model="editModal.form.description" rows="4" class="mt-1 w-full rounded-lg px-3 py-2
                 bg-[var(--card)] text-[var(--fg)]
                 border border-[var(--card-border)]
                 placeholder:text-[var(--muted)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" />

                <div class="mt-4 flex justify-end gap-2">
                    <button type="button" class="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)]
                   hover:brightness-95 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" @click="editModal.open = false">
                        ยกเลิก
                    </button>
                    <button type="submit" :disabled="editModal.loading" class="px-4 py-2 rounded-lg bg-[var(--brand)] text-[var(--brand-contrast)]
                   hover:brightness-110 cursor-pointer disabled:opacity-60
                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                        {{ editModal.loading ? 'กำลังบันทึก…' : 'บันทึก' }}
                    </button>
                </div>

                <p v-if="editModal.err" class="mt-3 text-sm text-rose-600">{{ editModal.err }}</p>
            </form>
        </div>
    </div>

    <!-- Modal: Delete -->
    <div v-if="deleteModal.open"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="deleteModal.open = false">
        <div class="w-full max-w-md rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg p-5">
            <div class="text-lg font-semibold mb-2">ลบแชนแนล</div>
            <p class="text-sm text-[var(--muted)]">
                ยืนยันการลบแชนแนล <span class="font-semibold text-[var(--fg)]">{{ deleteModal.target?.title }}</span> ?
            </p>
            <div class="mt-4 flex justify-end gap-2">
                <button class="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)]
                 hover:brightness-95 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" @click="deleteModal.open = false">
                    ยกเลิก
                </button>
                <button class="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 cursor-pointer disabled:opacity-60
                 focus:outline-none focus:ring-2 focus:ring-rose-300" :disabled="deleteModal.loading"
                    @click="confirmDelete">
                    {{ deleteModal.loading ? 'กำลังลบ…' : 'ลบ' }}
                </button>
            </div>
            <p v-if="deleteModal.err" class="mt-3 text-sm text-rose-600">{{ deleteModal.err }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
type Channel = {
    id: string | number
    title: string
    description?: string | null
    created_at?: string | null
    status?: string | null
}

const { public: { apiBase } } = useRuntimeConfig()
const { token } = useSession()

/* ===== state ===== */
const channels = reactive<Channel[]>([])
const q = ref('')
const statusFilter = ref<'all' | 'public' | 'private'>('all')
const loading = ref(false)
const pageErr = ref('')
const creating = ref(false)
const createOpen = ref(false)   // <- modal state
const errMsg = ref('')
const okMsg = ref('')
const newCh = reactive<{ title: string; description: string | null }>({ title: '', description: null })

/* dropdown */
const openMenuId = ref<string | number | null>(null)
const toggleMenu = (id: string | number) => { openMenuId.value = openMenuId.value === id ? null : id }

/* roots */
const cardsRoot = ref<HTMLElement | null>(null)
const handleOutsidePointer = (e: PointerEvent) => {
    if (!cardsRoot.value) return
    const target = e.target as Node
    if (!cardsRoot.value.contains(target)) openMenuId.value = null
}

/* details/edit/delete modal */
const detailModal = reactive({ open: false, data: null as any })
const editModal = reactive({ open: false, id: null as string | number | null, form: { title: '', description: '' as string | null }, loading: false, err: '' })
const deleteModal = reactive({ open: false, target: null as Channel | null, loading: false, err: '' })

/* ===== utils ===== */
const filteredByText = computed(() => {
    const k = q.value.trim().toLowerCase()
    if (!k) return channels
    return channels.filter(c => (c.title || '').toLowerCase().includes(k) || (c.description || '').toLowerCase().includes(k))
})
const visible = computed(() => {
    if (statusFilter.value === 'all') return filteredByText.value
    const s = statusFilter.value
    return filteredByText.value.filter(c => (c.status || '').toLowerCase() === s)
})
const authHeaders = () => {
    const h: Record<string, string> = { Accept: 'application/json' }
    if (token.value) h.Authorization = `Bearer ${token.value}`
    return h
}
const looksLikeHtml = (v: unknown) => typeof v === 'string' && /<!DOCTYPE|<html/i.test(v)

/* badges */
const badgeClass = (status?: string | null) => {
    const s = (status || '').toLowerCase()
    if (s === 'public' || s === 'active') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (s === 'private') return 'bg-zinc-100 text-zinc-700 border-zinc-200'
    if (s === 'draft') return 'bg-amber-100 text-amber-800 border-amber-200'
    if (s === 'inactive') return 'bg-rose-100 text-rose-700 border-rose-200'
    return 'bg-zinc-100 text-zinc-700 border-zinc-200'
}
const pillClass = (active: boolean) => [
    'px-3 py-1.5 rounded-full text-sm font-medium transition',
    active ? 'bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm' : 'text-[var(--fg)] hover:bg-black/5',
].join(' ')

/* ===== API: list ===== */
const loadMyChannels = async () => {
    pageErr.value = ''; loading.value = true
    try {
        const query: Record<string, any> = {}
        if (q.value?.trim()) query.search_by_name = q.value.trim()
        const res: any = await $fetch(`${apiBase}/channels/list/`, { method: 'GET', headers: authHeaders(), query })
        if (!Array.isArray(res)) throw new Error('รูปแบบข้อมูลผิด')
        channels.splice(0, channels.length, ...res.map((r: any) => ({
            id: r?.channels_id ?? r?.id,
            title: r?.title ?? 'Untitled',
            description: r?.description ?? null,
            created_at: r?.created_at ?? null,
            status: (r?.status ?? '—') as string,
        })))
    } catch (e: any) {
        const detail = e?.data?.detail ?? e?.message ?? e
        pageErr.value = `[GET] ${apiBase}/channels/list : ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`
    } finally { loading.value = false }
}

/* details */
const openDetails = async (id: string | number) => {
    try {
        const data: any = await $fetch(`${apiBase}/channels/${id}`, { method: 'GET', headers: authHeaders() })
        detailModal.data = data; detailModal.open = true
    } catch (e: any) { pageErr.value = e?.data?.detail || e?.message || `โหลดรายละเอียดไม่สำเร็จ (id=${id})` }
}

/* edit */
const openEdit = (ch: Channel) => { editModal.id = ch.id; editModal.form.title = ch.title; editModal.form.description = ch.description ?? ''; editModal.err = ''; editModal.open = true }
const submitEdit = async () => {
    if (!editModal.id) return
    editModal.loading = true; editModal.err = ''
    try {
        await $fetch(`${apiBase}/channels/${editModal.id}`, {
            method: 'PUT',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: { title: editModal.form.title.trim(), description: (editModal.form.description || '').trim() },
            credentials: 'include',
        })
        await loadMyChannels(); editModal.open = false
    } catch (e: any) { editModal.err = e?.data?.detail || e?.message || 'บันทึกการแก้ไขไม่สำเร็จ' }
    finally { editModal.loading = false }
}

/* delete */
const openDelete = (ch: Channel) => { deleteModal.target = ch; deleteModal.err = ''; deleteModal.open = true }
const confirmDelete = async () => {
    if (!deleteModal.target) return
    deleteModal.loading = true
    try {
        await $fetch(`${apiBase}/channels/${deleteModal.target.id}`, { method: 'DELETE', headers: authHeaders(), credentials: 'include' })
        await loadMyChannels(); deleteModal.open = false
    } catch (e: any) { deleteModal.err = e?.data?.detail || e?.message || 'ลบไม่สำเร็จ กรุณาลองใหม่' }
    finally { deleteModal.loading = false }
}

/* create */
const resetForm = () => { newCh.title = ''; newCh.description = null; errMsg.value = ''; okMsg.value = '' }
const createSessionForMe = async (channelId: string | number) => {
    try {
        await $fetch(`${apiBase}/create/session`, { method: 'POST', body: { channel_id: Number(channelId) }, headers: { ...authHeaders(), 'Content-Type': 'application/json' }, credentials: 'include' })
    } catch { }
}
const createChannel = async () => {
    errMsg.value = ''; okMsg.value = ''
    if (!newCh.title.trim()) { errMsg.value = 'กรุณากรอกชื่อแชนแนล'; return }
    creating.value = true
    try {
        const fd = new FormData()
        fd.append('title', newCh.title.trim())
        if (newCh.description?.trim()) fd.append('description', newCh.description.trim())
        const res: any = await $fetch(`${apiBase}/channels`, { method: 'POST', body: fd, headers: authHeaders(), credentials: 'include' }) //สำคัญ
        const respId = !looksLikeHtml(res) ? res?.channel_id ?? res?.channels_id ?? res?.id : null
        if (respId) await createSessionForMe(respId)
        await loadMyChannels()
        okMsg.value = 'สร้างแชนแนลสำเร็จ'
        resetForm(); createOpen.value = false
    } catch (e: any) { errMsg.value = e?.data?.detail || e?.message || 'สร้างแชนแนลไม่สำเร็จ' }
    finally { creating.value = false }
}

onMounted(() => { document.addEventListener('pointerdown', handleOutsidePointer, { passive: true }); loadMyChannels() })
onBeforeUnmount(() => { document.removeEventListener('pointerdown', handleOutsidePointer) })
</script>
