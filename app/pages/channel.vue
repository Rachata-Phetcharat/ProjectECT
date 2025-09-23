<template>
    <!-- Top -->
    <div class="px-6 py-4 flex justify-between">
        <div class="flex items-center gap-3">
            <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" type="button"
                class="text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-8 focus:outline-none cursor-pointer">
                <div class="flex items-center gap-2">
                    <Icon name="line-md:plus-square" class="w-5 h-5" />
                    สร้างแชนแนลใหม่
                </div>
            </button>
        </div>

        <!-- ใส่ z-50 เพื่อกันโดนบัง / คลิกไม่ติด -->
        <div class="relative z-50">
            <UserMenu />
        </div>
    </div>

    <!-- Search -->
    <div class="px-6">
        <input v-model="q" type="text" placeholder="ค้นหาแชนแนลของฉัน..."
            class="w-full md:w-[28rem] bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <!-- Error -->
    <div v-if="pageErr" class="px-6 pt-2 text-sm text-red-300">
        {{ pageErr }}
    </div>

    <div class="px-6 pt-6 text-gray-400">
        แชนแนลของฉัน ({{ filtered.length }} / {{ channels.length }})
    </div>
    <!-- List -->
    <div class="px-6 pt-6">
        <div ref="cardsRoot" class="flex flex-wrap gap-6">
            <!-- Add card -->
            <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" type="button"
                class="group flex h-[220px] w-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-slate-800/40 text-gray-300 hover:text-white hover:border-white/30 transition cursor-pointer">
                <div class="flex items-center gap-2">
                    <Icon name="line-md:plus" class="h-6 w-6" />
                    <span class="font-medium">สร้างแชนแนลใหม่</span>
                </div>
            </button>

            <!-- CHANNEL CARDS -->
            <div v-for="ch in filtered" :key="ch.id" @click="navigateTo(`/chat?id=${ch.id}`)"
                class="relative h-[220px] w-[280px] cursor-pointer rounded-2xl border border-white/10 bg-slate-800 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                <!-- 3-dots menu button -->
                <button type="button" aria-label="เมนู" @click.stop="toggleMenu(ch.id)"
                    class="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/80 text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
                    <Icon name="lucide:more-vertical" class="h-5 w-5" />
                </button>

                <!-- dropdown -->
                <div v-if="openMenuId === ch.id"
                    class="absolute right-3 top-12 z-20 w-40 rounded-lg border border-gray-700 bg-gray-800 shadow-xl"
                    @click.stop>
                    <button
                        class="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
                        @click="openDetails(ch.id)">
                        รายละเอียด
                    </button>
                    <button
                        class="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
                        @click="openEdit(ch)">
                        แก้ไข
                    </button>
                    <button
                        class="block w-full px-4 py-2 text-left text-sm text-rose-300 hover:bg-gray-700 cursor-pointer"
                        @click="openDelete(ch)">
                        ลบ
                    </button>
                </div>

                <!-- เนื้อการ์ด -->
                <div class="pr-2">
                    <h3 class="mb-1 line-clamp-1 text-xl font-bold text-white">
                        {{ ch.title }}
                    </h3>

                    <p class="text-xs text-gray-300">วันที่สร้าง: {{ ch.created_at || '-' }}</p>

                    <!-- สถานะ -->
                    <div class="mt-3">
                        <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                            :class="badgeClass(ch.status)">
                            {{ ch.status || '—' }}
                        </span>
                    </div>
                </div>

                <!-- ปุ่มด้านล่าง (รายละเอียดยังคงมี) -->
                <div class="absolute inset-x-5 bottom-4 flex gap-2">
                    <button type="button" @click.stop="openDetails(ch.id)"
                        class="cursor-pointer rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        รายละเอียด
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Create Channel -->
    <div id="crud-modal" tabindex="-1" aria-hidden="true"
        class="hidden fixed inset-0 z-50 flex justify-center items-center w-full h-full backdrop-blur-sm bg-black/50">
        <div class="relative p-4 w-full max-w-md">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">สร้างแชนแนลใหม่</h3>
                    <button type="button"
                        class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        data-modal-toggle="crud-modal">
                        <Icon name="line-md:close" class="w-5 h-5" />
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>

                <form class="p-4 md:p-5" @submit.prevent="createChannel">
                    <div class="grid gap-4 mb-4 grid-cols-2">
                        <div class="col-span-2">
                            <label
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อแชนแนล</label>
                            <input v-model="newCh.title" type="text" required
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                        </div>
                    </div>

                    <div class="grid gap-4 mb-4 grid-cols-2">
                        <div class="col-span-2">
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คำอธิบาย</label>
                            <textarea v-model="newCh.description" rows="4"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                        </div>
                    </div>

                    <button type="submit" :disabled="creating"
                        class="cursor-pointer text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 disabled:opacity-60">
                        {{ creating ? 'กำลังสร้าง…' : 'ตกลง' }}
                    </button>
                    <button type="reset" @click="resetForm"
                        class="cursor-pointer text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
                        ล้างค่า
                    </button>

                    <p v-if="errMsg" class="mt-3 text-sm text-red-400">{{ errMsg }}</p>
                    <p v-if="okMsg" class="mt-3 text-sm text-emerald-400">{{ okMsg }}</p>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal: Details -->
    <div v-if="detailModal.open"
        class="fixed inset-0 z-50 text-white flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="detailModal.open = false">
        <div class="w-full max-w-lg bg-gray-800 rounded-xl border border-gray-700 p-5">
            <div class="flex justify-between items-center mb-3">
                <div class="text-xl font-semibold">รายละเอียดแชนแนล</div>
                <button class="cursor-pointer" @click="detailModal.open = false">
                    <Icon name="line-md:close" class="w-6 h-6" />
                </button>
            </div>
            <div class="space-y-2 text-sm">
                <div><span class="text-gray-400">ชื่อ:</span> {{ detailModal.data?.title || '-' }}</div>
                <div><span class="text-gray-400">คำอธิบาย:</span> {{ detailModal.data?.description || '-' }}</div>
                <div><span class="text-gray-400">สถานะ:</span> {{ detailModal.data?.status || '—' }}</div>
                <div><span class="text-gray-400">วันที่สร้าง:</span> {{ detailModal.data?.created_at || '—' }}</div>
            </div>
            <div class="mt-4 text-right">
                <button class="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg cursor-pointer"
                    @click="detailModal.open = false">
                    ปิด
                </button>
            </div>
        </div>
    </div>

    <!-- Modal: Edit -->
    <div v-if="editModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white"
        @click.self="editModal.open = false">
        <div class="w-full max-w-md bg-gray-800 rounded-xl border border-gray-700 p-5">
            <div class="flex justify-between items-center mb-3">
                <div class="text-xl font-semibold">แก้ไขแชนแนล</div>
                <button class="cursor-pointer" @click="editModal.open = false">
                    <Icon name="line-md:close" class="w-6 h-6" />
                </button>
            </div>

            <form @submit.prevent="submitEdit">
                <label class="text-sm text-gray-300">ชื่อแชนแนล</label>
                <input v-model="editModal.form.title" type="text"
                    class="mt-1 mb-3 w-full rounded-lg bg-gray-700 border border-gray-600 p-2 focus:outline-none"
                    required />

                <label class="text-sm text-gray-300">คำอธิบาย</label>
                <textarea v-model="editModal.form.description" rows="4"
                    class="mt-1 w-full rounded-lg bg-gray-700 border border-gray-600 p-2 focus:outline-none" />

                <div class="mt-4 flex justify-end gap-2">
                    <button type="button" class="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 cursor-pointer"
                        @click="editModal.open = false">
                        ยกเลิก
                    </button>
                    <button type="submit" :disabled="editModal.loading"
                        class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 cursor-pointer disabled:opacity-60">
                        {{ editModal.loading ? 'กำลังบันทึก…' : 'บันทึก' }}
                    </button>
                </div>

                <p v-if="editModal.err" class="mt-3 text-sm text-red-400">{{ editModal.err }}</p>
            </form>
        </div>
    </div>

    <!-- Modal: Delete -->
    <div v-if="deleteModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="deleteModal.open = false">
        <div class="w-full max-w-md bg-gray-800 rounded-xl border border-gray-700 p-5">
            <div class="text-lg font-semibold mb-2">ลบแชนแนล</div>
            <p class="text-sm text-gray-300">
                ยืนยันการลบแชนแนล <span class="font-semibold">{{ deleteModal.target?.title }}</span> ?
            </p>
            <div class="mt-4 flex justify-end gap-2">
                <button class="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 cursor-pointer"
                    @click="deleteModal.open = false">
                    ยกเลิก
                </button>
                <button class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 cursor-pointer"
                    :disabled="deleteModal.loading" @click="confirmDelete">
                    {{ deleteModal.loading ? 'กำลังลบ…' : 'ลบ' }}
                </button>
            </div>
            <p v-if="deleteModal.err" class="mt-3 text-sm text-red-400">{{ deleteModal.err }}</p>
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

const {
    public: { apiBase },
} = useRuntimeConfig()
const { token } = useSession()

/* ===== state ===== */
const channels = reactive<Channel[]>([])
const q = ref('')
const pageErr = ref('')
const creating = ref(false)
const errMsg = ref('')
const okMsg = ref('')
const newCh = reactive<{ title: string; description: string | null }>({
    title: '',
    description: null,
})

/* 3-dots dropdown */
const openMenuId = ref<string | number | null>(null)
const toggleMenu = (id: string | number) => {
    openMenuId.value = openMenuId.value === id ? null : id
}

/* root ที่ครอบกริดการ์ด — ใช้ตรวจว่าคลิกนอกแล้วค่อยปิดเมนู */
const cardsRoot = ref<HTMLElement | null>(null)
const handleOutsidePointer = (e: PointerEvent) => {
    if (!cardsRoot.value) return
    const target = e.target as Node
    if (!cardsRoot.value.contains(target)) {
        openMenuId.value = null
    }
}

/* details modal */
const detailModal = reactive({
    open: false,
    data: null as any,
})

/* edit modal */
const editModal = reactive({
    open: false,
    id: null as string | number | null,
    form: { title: '', description: '' as string | null },
    loading: false,
    err: '',
})

/* delete modal */
const deleteModal = reactive({
    open: false,
    target: null as Channel | null,
    loading: false,
    err: '',
})

/* ===== utils ===== */
const filtered = computed(() => {
    const k = q.value.trim().toLowerCase()
    if (!k) return channels
    return channels.filter(
        (c) => (c.title || '').toLowerCase().includes(k) || (c.description || '').toLowerCase().includes(k),
    )
})
const authHeaders = () => {
    const h: Record<string, string> = { Accept: 'application/json' }
    if (token.value) h.Authorization = `Bearer ${token.value}`
    return h
}
const looksLikeHtml = (v: unknown) => typeof v === 'string' && /<!DOCTYPE|<html/i.test(v)

/* ป้ายสถานะ */
const badgeClass = (status?: string | null) => {
    const s = (status || '').toLowerCase()
    if (s === 'public' || s === 'active') return 'bg-green-600 text-white'
    if (s === 'draft') return 'bg-yellow-500 text-black'
    if (s === 'private' || s === 'inactive') return 'bg-red-600 text-white'
    return 'bg-gray-600 text-white'
}

/* ===== API: list ===== */
const loadMyChannels = async () => {
    pageErr.value = ''
    try {
        const query: Record<string, any> = {}
        if (q.value?.trim()) query.search_by_name = q.value.trim()

        const res: any = await $fetch(`${apiBase}/channels/list/`, {
            method: 'GET',
            headers: authHeaders(),
            query,
        })

        if (!Array.isArray(res)) throw new Error('รูปแบบข้อมูลผิด')

        channels.splice(
            0,
            channels.length,
            ...res.map((r: any) => ({
                id: r?.channels_id ?? r?.id,
                title: r?.title ?? 'Untitled',
                description: r?.description ?? null,
                created_at: r?.created_at ?? null,
                status: r?.status ?? '—',
            })),
        )
    } catch (e: any) {
        const detail = e?.data?.detail ?? e?.message ?? e
        pageErr.value = `[GET] ${apiBase}/channels/list : ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`
    }
}

/* ===== API: detail ===== */
const openDetails = async (id: string | number) => {
    try {
        const data: any = await $fetch(`${apiBase}/channels/${id}`, {
            method: 'GET',
            headers: authHeaders(),
        })
        detailModal.data = data
        detailModal.open = true
    } catch (e: any) {
        pageErr.value = e?.data?.detail || e?.message || `โหลดรายละเอียดไม่สำเร็จ (id=${id})`
    }
}

/* ===== open edit with prefill ===== */
const openEdit = (ch: Channel) => {
    editModal.id = ch.id
    editModal.form.title = ch.title
    editModal.form.description = ch.description ?? ''
    editModal.err = ''
    editModal.open = true
}

/* ===== submit edit ===== */
const submitEdit = async () => {
    if (!editModal.id) return
    editModal.loading = true
    editModal.err = ''
    try {
        // backend รอ JSON สำหรับแก้ไขชื่อ/รายละเอียด
        await $fetch(`${apiBase}/channels/${editModal.id}`, {
            method: 'PUT',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: {
                title: editModal.form.title.trim(),
                description: (editModal.form.description || '').trim(),
                // ไม่ส่ง status ถ้าไม่แก้ (ตามที่ตกลง)
            },
            credentials: 'include',
        })

        await loadMyChannels()
        editModal.open = false
    } catch (e: any) {
        editModal.err = e?.data?.detail || e?.message || 'บันทึกการแก้ไขไม่สำเร็จ'
    } finally {
        editModal.loading = false
    }
}

/* ===== delete flow ===== */
const openDelete = (ch: Channel) => {
    deleteModal.target = ch
    deleteModal.err = ''
    deleteModal.open = true
}
const confirmDelete = async () => {
    if (!deleteModal.target) return
    deleteModal.loading = true
    deleteModal.err = ''
    try {
        await $fetch(`${apiBase}/channels/${deleteModal.target.id}`, {
            method: 'DELETE',
            headers: authHeaders(),
            credentials: 'include',
        })
        await loadMyChannels()
        deleteModal.open = false
    } catch (e: any) {
        deleteModal.err = e?.data?.detail || e?.message || 'ลบไม่สำเร็จ กรุณาลองใหม่'
    } finally {
        deleteModal.loading = false
    }
}

/* ===== helper (create) ===== */
const resetForm = () => {
    newCh.title = ''
    newCh.description = null
    errMsg.value = ''
    okMsg.value = ''
}
const closeModal = () => {
    const el = document.getElementById('crud-modal')
    if (el) {
        el.classList.add('hidden')
        el.setAttribute('aria-hidden', 'true')
    }
}

/* ===== API: create session ===== */
const createSessionForMe = async (channelId: string | number) => {
    try {
        await $fetch(`${apiBase}/create/session`, {
            method: 'POST',
            body: { channel_id: Number(channelId) },
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            credentials: 'include',
        })
    } catch (e) {
        console.warn('create session failed', e)
    }
}

/* ===== API: create channel ===== */
const createChannel = async () => {
    errMsg.value = ''
    okMsg.value = ''
    if (!newCh.title.trim()) {
        errMsg.value = 'กรุณากรอกชื่อแชนแนล'
        return
    }

    creating.value = true
    try {
        const fd = new FormData()
        fd.append('title', newCh.title.trim())
        if (newCh.description?.trim()) fd.append('description', newCh.description.trim())

        const res: any = await $fetch(`${apiBase}/channels`, {
            method: 'POST',
            body: fd,
            headers: authHeaders(),
            credentials: 'include',
        })

        const respId = !looksLikeHtml(res) ? res?.channel_id ?? res?.channels_id ?? res?.id : null
        if (respId) {
            await createSessionForMe(respId)
        }
        await loadMyChannels()
        okMsg.value = 'สร้างแชนแนลสำเร็จ'
        resetForm()
        closeModal()
    } catch (e: any) {
        errMsg.value = e?.data?.detail || e?.message || 'สร้างแชนแนลไม่สำเร็จ'
    } finally {
        creating.value = false
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleOutsidePointer, { passive: true })
    loadMyChannels()
})
onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleOutsidePointer)
})
</script>
