<template>
    <div class="bg-slate-900 min-h-screen flex flex-col">
        <!-- Top bar -->
        <div class="px-10 py-2 flex justify-between items-center bg-slate-900">
            <div class="pt-2 text-white truncate">
                <span class="opacity-70">Channel ID: </span>{{ channelId || '-' }}
            </div>
            <UserMenu />
        </div>

        <!-- Error line -->
        <div v-if="pageErr" class="px-10 text-rose-300 text-sm">
            {{ pageErr }}
        </div>

        <div class="flex flex-1 gap-4 px-10 py-4 overflow-hidden">
            <!-- Left: Sources / Files -->
            <div class="bg-slate-600 rounded-lg p-4 basis-1/4 overflow-auto">
                <div class="text-white font-bold text-lg mb-4">แหล่งข้อมูล</div>
                <hr class="border-gray-400" />

                <button type="button" @click="openUploadModal"
                    class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 mt-4 cursor-pointer">
                    เพิ่มแหล่งข้อมูล
                </button>

                <!-- Files list -->
                <ul class="mt-4 space-y-2">
                    <li v-for="f in files" :key="f.files_id || f.fileId"
                        class="group flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
                        <Icon name="line-md:file-document" class="w-5 h-5 me-3" />
                        <span class="flex-1 whitespace-nowrap truncate">
                            {{ f.original_filename }}
                        </span>

                        <button
                            class="ml-2 rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-500 cursor-pointer"
                            :disabled="deletingIds.has(fileKey(f))" @click="deleteFile(f)">
                            {{ deletingIds.has(fileKey(f)) ? 'ลบ...' : 'ลบ' }}
                        </button>
                    </li>

                    <li v-if="!loading && files.length === 0" class="p-2 text-gray-200 text-sm opacity-80">
                        — ยังไม่มีไฟล์ในช่องนี้ —
                    </li>
                </ul>
            </div>

            <!-- Right: Chat area (placeholder) -->
            <div class="bg-slate-600 rounded-lg p-4 flex-1 flex flex-col">
                <div class="text-white font-bold text-lg mb-4">แชท</div>
                <hr class="border-gray-400" />
                <div class="mt-4 px-8 text-white/80">ใส่ UI แชทของคุณได้ตามต้องการ</div>
            </div>
        </div>

        <!-- Upload Modal -->
        <div v-if="uploadOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeUploadModal">
            <div class="w-full max-w-2xl rounded-xl bg-gray-800 border border-gray-700">
                <div class="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 class="text-white text-lg font-semibold">อัปโหลดไฟล์เข้าช่อง</h3>
                    <button class="cursor-pointer text-gray-300 hover:text-white" @click="closeUploadModal">
                        <Icon name="line-md:close" class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-5 space-y-4">
                    <p class="text-sm text-gray-300">
                        ช่อง: <span class="font-semibold text-white">{{ channelId || '-' }}</span>
                    </p>

                    <!-- Dropzone -->
                    <label for="files"
                        class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 border-gray-500">
                        <div class="flex flex-col items-center justify-center p-6 text-gray-200">
                            <Icon name="line-md:cloud-upload" class="w-8 h-8 mb-3" />
                            <p class="text-sm"><span class="font-semibold">คลิกเพื่อเลือก</span> หรือ ลากไฟล์มาวาง</p>
                            <p class="text-xs opacity-80">รองรับหลายไฟล์ (แนะนำ PDF)</p>
                        </div>
                        <input id="files" ref="fileInput" type="file" class="hidden" multiple @change="pickFiles" />
                    </label>

                    <!-- Selected list -->
                    <div v-if="picked.length" class="text-sm text-gray-200">
                        <div class="mb-2 font-semibold">ไฟล์ที่เลือก ({{ picked.length }})</div>
                        <ul class="space-y-1 max-h-40 overflow-auto pr-1">
                            <li v-for="(f, i) in picked" :key="i" class="flex items-center justify-between">
                                <span class="truncate">{{ f.name }}</span>
                                <button class="text-rose-300 hover:text-rose-200 cursor-pointer"
                                    @click="removePicked(i)">ลบออก</button>
                            </li>
                        </ul>
                    </div>

                    <div class="flex items-center justify-end gap-2">
                        <button type="button"
                            class="cursor-pointer rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-500"
                            @click="closeUploadModal">
                            ยกเลิก
                        </button>
                        <button type="button"
                            class="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-60"
                            :disabled="uploading || picked.length === 0 || !channelId" @click="uploadFiles">
                            {{ uploading ? 'อัปโหลด...' : 'อัปโหลด' }}
                        </button>
                    </div>

                    <p v-if="uploadErr" class="text-rose-300 text-sm">{{ uploadErr }}</p>
                    <p v-if="uploadOk" class="text-emerald-400 text-sm">{{ uploadOk }}</p>
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

// ------- state
const channelId = computed<number | null>(() => {
    const v = Number(route.query.id)
    return Number.isFinite(v) && v > 0 ? v : null
})
const pageErr = ref('')
const loading = ref(false)
const files = ref<FileItem[]>([])
const deletingIds = reactive(new Set<string | number>())

// upload modal
const uploadOpen = ref(false)
const picked = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadErr = ref('')
const uploadOk = ref('')

// ------- helpers
const authHeaders = () => {
    const h: Record<string, string> = { Accept: 'application/json' }
    if (token.value) h.Authorization = `Bearer ${token.value}`
    return h
}
const fileKey = (f: FileItem) => f.files_id ?? f.fileId ?? `name:${f.original_filename}`

// ------- API
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
        // เดาว่า backend ส่ง files เป็น array (ชื่อฟิลด์อาจต่าง — รองรับหลายชื่อ)
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
            headers: authHeaders(), // อย่าใส่ Content-Type เอง ให้ browser จัดการ boundary
            credentials: 'include',
        })

        uploadOk.value = 'อัปโหลดสำเร็จ'
        picked.value = []
        fileInput.value?.value && (fileInput.value.value = '')
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
        // แสดงบนแถบ error ด้านบนให้เห็นรวม
        pageErr.value = 'ลบไฟล์ไม่สำเร็จ'
    } finally {
        deletingIds.delete(fileKey(f))
    }
}

// ------- modal controls
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

// init
onMounted(loadChannelFiles)
watch(channelId, () => loadChannelFiles())
</script>
