<template>
    <div class="bg-[var(--bg)] text-[var(--fg)] min-h-[100dvh]">
        <!-- Top bar (อ้างอิงความสูง) -->
        <div ref="chromeTop"
            class="px-6 lg:px-10 py-3 flex justify-between items-center border-b border-[var(--card-border)] bg-[var(--card)]">
            <div class="flex items-center gap-3 min-w-0">
                <!-- <NuxtLink to="/"
                    class="hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border border-[var(--card-border)] bg-[var(--card)] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                    <Icon name="lucide:arrow-left" class="w-4 h-4" />
                    กลับ
                </NuxtLink> -->
                <div class="pt-1 truncate">
                    <span class="opacity-70">Channel : </span>
                    <span class="font-medium">&nbsp;{{ channelTitle || '-' }}</span>
                </div>
            </div>
            <UserMenu />
        </div>

        <!-- สองพาเนล: กำหนดความสูงด้วย style เดียวกัน -->
        <main class="px-6 lg:px-10 py-4">
            <div class="grid grid-cols-12 gap-4" :style="{ height: contentH + 'px' }">
                <!-- LEFT: แหล่งข้อมูล -->
                <section class="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-3
                 h-full rounded-xl border border-[var(--card-border)] bg-[var(--card)]
                 flex flex-col overflow-hidden">
                    <!-- header -->
                    <div class="p-4 border-b border-[var(--card-border)]">
                        <div class="flex items-center justify-between gap-2">
                            <div class="font-semibold text-lg">แหล่งข้อมูล</div>
                            <button type="button" @click="openUploadModal" class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer
                       bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110
                       focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                                <Icon name="line-md:plus" class="w-4 h-4" />
                                เพิ่มไฟล์
                            </button>
                        </div>

                        <!-- ค้นหาไฟล์ -->
                        <div class="mt-3 relative">
                            <Icon name="lucide:search"
                                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                            <input v-model="fileQuery" type="text" placeholder="ค้นหาไฟล์ในช่องนี้…" class="w-full rounded-lg pl-9 pr-3 py-2 bg-[var(--card)] text-[var(--fg)]
                       border border-[var(--card-border)] placeholder:text-[var(--muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" />
                        </div>
                    </div>

                    <!-- รายการไฟล์ (เลื่อนในกรอบนี้) -->
                    <div class="flex-1 min-h-0 overflow-y-auto p-3">
                        <ul class="space-y-2">
                            <li v-for="f in filesView" :key="f.files_id || f.fileId"
                                class="group flex items-center gap-2 p-2 rounded-lg border border-[var(--card-border)] hover:bg-black/5 transition">
                                <Icon name="line-md:file-document" class="w-5 h-5 opacity-80" />
                                <span class="flex-1 whitespace-nowrap truncate">{{ f.original_filename }}</span>
                                <button
                                    class="ml-2 rounded-md px-2 py-1 text-xs font-semibold border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                                    :disabled="deletingIds.has(fileKey(f))" @click="deleteFile(f)">
                                    {{ deletingIds.has(fileKey(f)) ? 'ลบ...' : 'ลบ' }}
                                </button>
                            </li>

                            <li v-if="!loading && filesView.length === 0" class="p-4">
                                <div
                                    class="rounded-lg border-2 border-dashed border-[var(--card-border)] bg-[var(--bg)]/60 text-center py-8">
                                    <Icon name="lucide:inbox" class="w-7 h-7 mx-auto opacity-60" />
                                    <p class="mt-2 text-sm text-[var(--muted)]">ยังไม่มีไฟล์ หรือไม่พบไฟล์ที่ค้นหา</p>
                                    <div class="mt-3">
                                        <button type="button" @click="openUploadModal" class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer
                             bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110
                             focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                                            <Icon name="line-md:plus" class="w-4 h-4" />
                                            อัปโหลดไฟล์
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <!-- RIGHT: แชท -->
                <section class="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-9
                 h-full rounded-xl border border-[var(--card-border)] bg-[var(--card)]
                 flex flex-col overflow-hidden">
                    <!-- header -->
                    <div class="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
                        <div class="font-semibold text-lg">แชท</div>
                        <!-- <div class="text-xs text-[var(--muted)]">UI แชทตัวอย่างเท่านั้น</div> -->
                    </div>

                    <!-- ข้อความ (เลื่อนในกรอบนี้) -->
                    <div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                        <div
                            class="max-w-[70%] rounded-2xl px-4 py-3 border border-[var(--card-border)] bg-[var(--bg)]">
                            👋 ยินดีต้อนรับ! อัปโหลดไฟล์ทางซ้าย แล้วเริ่มถามได้เลย
                        </div>
                        <div
                            class="max-w-[70%] ml-auto rounded-2xl px-4 py-3 border border-[var(--card-border)] bg-[var(--card)]">
                            ข้อความของฉันจะอยู่ด้านขวา
                        </div>
                    </div>

                    <!-- composer -->
                    <div class="p-4 border-t border-[var(--card-border)] bg-[var(--card)]">
                        <div
                            class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] flex items-center gap-2 px-3 py-2 shadow-sm">
                            <button type="button"
                                class="rounded-md px-2 py-1.5 text-sm border border-[var(--card-border)] hover:brightness-95">
                                <Icon name="lucide:paperclip" class="w-4 h-4" />
                            </button>
                            <input placeholder="พิมพ์ข้อความ…"
                                class="flex-1 bg-transparent outline-none placeholder:text-[var(--muted)]" />
                            <button class="rounded-md px-3 py-1.5 text-sm font-medium bg-[var(--brand)] text-[var(--brand-contrast)]
                       hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                                type="button">
                                ส่ง
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>

        <!-- Upload Modal -->
        <div v-if="uploadOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeUploadModal">
            <div class="w-full max-w-2xl rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg">
                <div class="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
                    <h3 class="text-lg font-semibold">อัปโหลดไฟล์เข้าช่อง</h3>
                    <button class="cursor-pointer text-[var(--muted)] hover:text-[var(--fg)]" @click="closeUploadModal">
                        <Icon name="line-md:close" class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-5 space-y-4">
                    <p class="text-sm">
                        ช่อง: <span class="font-semibold">{{ channelId || '-' }}</span>
                    </p>

                    <label for="files" class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
                   border-[var(--card-border)] bg-[var(--bg)] hover:bg-black/5 transition">
                        <div class="flex flex-col items-center justify-center p-6 text-[var(--muted)]">
                            <Icon name="line-md:cloud-upload" class="w-8 h-8 mb-3 opacity-80" />
                            <p class="text-sm"><span class="font-semibold text-[var(--fg)]">คลิกเพื่อเลือก</span> หรือ
                                ลากไฟล์มาวาง</p>
                            <p class="text-xs opacity-80">รองรับหลายไฟล์ (แนะนำ PDF)</p>
                        </div>
                        <input id="files" ref="fileInput" type="file" class="hidden" multiple @change="pickFiles" />
                    </label>

                    <div v-if="picked.length" class="text-sm">
                        <div class="mb-2 font-semibold">ไฟล์ที่เลือก ({{ picked.length }})</div>
                        <ul class="space-y-1 max-h-40 overflow-auto pr-1">
                            <li v-for="(f, i) in picked" :key="i" class="flex items-center justify-between">
                                <span class="truncate">{{ f.name }}</span>
                                <button class="text-rose-700 hover:text-rose-600 cursor-pointer"
                                    @click="removePicked(i)">ลบออก</button>
                            </li>
                        </ul>
                    </div>

                    <div class="flex items-center justify-end gap-2">
                        <button type="button"
                            class="cursor-pointer rounded-lg px-4 py-2 border border-[var(--card-border)] bg-[var(--card)] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                            @click="closeUploadModal">
                            ยกเลิก
                        </button>
                        <button type="button"
                            class="cursor-pointer rounded-lg px-4 py-2 text-[var(--brand-contrast)] bg-[var(--brand)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-60"
                            :disabled="uploading || picked.length === 0 || !channelId" @click="uploadFiles">
                            {{ uploading ? 'อัปโหลด...' : 'อัปโหลด' }}
                        </button>
                    </div>

                    <p v-if="uploadErr" class="text-rose-600 text-sm">{{ uploadErr }}</p>
                    <p v-if="uploadOk" class="text-emerald-600 text-sm">{{ uploadOk }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'plain' })

type FileItem = {
    files_id?: number | string
    fileId?: number | string
    original_filename?: string
}

const route = useRoute()
const { public: { apiBase } } = useRuntimeConfig()
const { token } = useSession()

/* ===== height sync: คำนวณความสูงพื้นที่คอนเทนต์ ===== */
const chromeTop = ref<HTMLElement | null>(null)
const contentH = ref(0)
const recalc = () => {
    const bottom = chromeTop.value?.getBoundingClientRect().bottom ?? 0
    const outerPad = 16 + 16 // padding top/bottom ของ <main> (px) ปรับได้ตามจริง
    contentH.value = Math.max(0, window.innerHeight - bottom - outerPad)
}
onMounted(() => {
    recalc()
    window.addEventListener('resize', recalc)
})
onBeforeUnmount(() => window.removeEventListener('resize', recalc))

/* ===== state เดิม ===== */
const channelId = computed<number | null>(() => {
    const v = Number(route.query.id)
    return Number.isFinite(v) && v > 0 ? v : null
})
const channelTitle = ref<string>('')
const pageErr = ref('')
const loading = ref(false)
const files = ref<FileItem[]>([])
const deletingIds = reactive(new Set<string | number>())

/* upload modal */
const uploadOpen = ref(false)
const picked = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadErr = ref('')
const uploadOk = ref('')

/* search ในรายการไฟล์ */
const fileQuery = ref('')
const filesView = computed(() => {
    const k = fileQuery.value.trim().toLowerCase()
    if (!k) return files.value
    return files.value.filter(f => (f.original_filename || '').toLowerCase().includes(k))
})

/* helpers */
const authHeaders = () => {
    const h: Record<string, string> = { Accept: 'application/json' }
    if (token.value) h.Authorization = `Bearer ${token.value}`
    return h
}
const fileKey = (f: FileItem) => f.files_id ?? f.fileId ?? `name:${f.original_filename}`

/* API */
const loadChannelFiles = async () => {
    if (!channelId.value) return
    pageErr.value = ''
    loading.value = true
    try {
        const res: any = await $fetch(`${apiBase}/channels/${channelId.value}`, {
            method: 'GET',
            headers: authHeaders(),
            credentials: 'include',
        })
        channelTitle.value = res?.title || `Channel #${channelId.value}`
        const arr = res?.files ?? res?.data?.files ?? []
        files.value = Array.isArray(arr) ? arr : []
    } catch (e: any) {
        pageErr.value = e?.data?.detail || e?.message || 'โหลดไฟล์ไม่สำเร็จ'
    } finally {
        loading.value = false
    }
}

const uploadFiles = async () => {
    if (!channelId.value || picked.value.length === 0) return
    uploadErr.value = ''
    uploadOk.value = ''
    uploading.value = true
    try {
        const fd = new FormData()
        fd.append('channel_id', String(channelId.value))
        picked.value.forEach(f => fd.append('files', f))
        await $fetch(`${apiBase}/files/upload`, {
            method: 'POST',
            body: fd,
            headers: authHeaders(),
            credentials: 'include',
        })
        uploadOk.value = 'อัปโหลดสำเร็จ'
        picked.value = []
        if (fileInput.value?.value) fileInput.value.value = ''
        await loadChannelFiles()
    } catch (e: any) {
        uploadErr.value = e?.data?.detail || e?.message || 'อัปโหลดไม่สำเร็จ'
    } finally {
        uploading.value = false
    }
}

const deleteFile = async (f: FileItem) => {
    const id = f.files_id
    if (!id) return
    deletingIds.add(fileKey(f))
    try {
        await $fetch(`${apiBase}/files/delete/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
            credentials: 'include',
        })
        await loadChannelFiles()
    } catch (e) {
        pageErr.value = 'ลบไฟล์ไม่สำเร็จ'
    } finally {
        deletingIds.delete(fileKey(f))
    }
}

/* modal controls */
const openUploadModal = () => {
    if (!channelId.value) {
        pageErr.value = 'ไม่พบ channel_id (โปรดเปิดจากลิงก์ /chat?id=<id>)'
        return
    }
    uploadErr.value = ''
    uploadOk.value = ''
    uploadOpen.value = true
}
const closeUploadModal = () => {
    if (uploading.value) return
    uploadOpen.value = false
}
const pickFiles = (e: Event) => {
    const target = e.target as HTMLInputElement
    const filesList = target.files ? Array.from(target.files) : []
    picked.value = filesList
}
const removePicked = (i: number) => picked.value.splice(i, 1)

/* init */
onMounted(loadChannelFiles)
watch(channelId, () => loadChannelFiles())
</script>
