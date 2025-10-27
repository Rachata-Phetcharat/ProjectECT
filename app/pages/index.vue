<template>
  <div class="min-h-[100dvh] bg-[var(--bg)] text-[var(--fg)]">
    <!-- ================= Header ================= -->
    <header class="border-b border-[var(--card-border)] bg-[var(--bg)]/90 backdrop-blur">
      <div class="mx-auto py-4 flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <!-- <div class="w-9 h-9 grid place-items-center rounded-lg border border-[var(--card-border)] bg-[var(--card)]">
            <Icon name="lucide:hash" class="w-5 h-5" />
          </div> -->
          <div class="truncate">
            <h1 class="text-xl sm:text-2xl font-bold leading-tight">RAG</h1>
            <p class="text-xs text-[var(--muted)] hidden sm:block">สำรวจแชนแนล แนะนำ และจัดการของคุณ</p>
          </div>
        </div>

        <div v-if="!isLoggedIn">
          <NuxtLink to="/login">
            <button type="button" class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer
                     bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110
                     focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition">
              <Icon name="line-md:login" class="w-4 h-4" />
              เข้าสู่ระบบ
            </button>
          </NuxtLink>
        </div>
        <div v-else>
          <UserMenu />
        </div>
      </div>
    </header>

    <!-- ============== Toolbar / Tabs ============== -->
    <div class="border-b border-[var(--card-border)] bg-[var(--bg)]">
      <div class="mx-auto py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="text-sm text-[var(--muted)]">
          {{ totalCount }} แชนแนลทั้งหมด
          <span class="mx-1">•</span>
          สาธารณะ {{ publicChannels.length }}
          <template v-if="isLoggedIn">
            <span class="mx-1">•</span> ของฉัน {{ myChannels.length }}
          </template>
        </div>

        <div class="inline-flex items-center gap-2">
          <div class="inline-flex rounded-full border border-[var(--card-border)] bg-[var(--card)] p-1">
            <template v-if="isLoggedIn">
              <button :class="segClass(activeTab === 'all')" @click="activeTab = 'all'">
                ทั้งหมด
              </button>
              <button :class="segClass(activeTab === 'mine')" @click="activeTab = 'mine'">
                ของฉัน
              </button>
            </template>
            <button :class="segClass(activeTab === 'recommended')" @click="activeTab = 'recommended'">
              แนะนำ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============== Error line ============== -->
    <div v-if="pageErr" class="mx-auto max-w-7xl px-6 pt-3 text-sm text-rose-600">
      {{ pageErr }}
    </div>

    <!-- ============== Content ============== -->
    <main class="mx-auto py-6">
      <!-- Recommended -->
      <section v-show="activeTab === 'recommended'">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลที่แนะนำ</h2>
          <p class="text-sm text-[var(--muted)]">ที่เปิดสาธารณะสำหรับทุกคน</p>
        </div>
        <ChannelGrid :items="publicChannels" />
        <div v-if="!publicChannels?.length"
          class="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center text-[var(--muted)]">
          ยังไม่มีแชนแนลสาธารณะ
        </div>
      </section>

      <!-- All -->
      <section v-if="isLoggedIn" v-show="activeTab === 'all'">
        <div class="mb-3">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลที่แนะนำ</h2>
        </div>
        <ChannelGrid :items="publicChannels" />

        <div class="mt-10 mb-3">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลของฉัน</h2>
        </div>
        <ChannelGrid :items="myChannels" />

        <div v-if="!myChannels?.length"
          class="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center text-[var(--muted)]">
          ยังไม่มีแชนแนลของคุณ — สร้างจากหน้า <NuxtLink to="/channel" class="underline hover:no-underline">จัดการแชนแนล
          </NuxtLink>
        </div>
      </section>

      <!-- Mine -->
      <section v-if="isLoggedIn" v-show="activeTab === 'mine'">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลของฉัน</h2>
          <NuxtLink to="/channel" class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border border-[var(--card-border)] bg-[var(--card)]
                   hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
            <Icon name="line-md:plus" class="w-4 h-4" />
            จัดการ/สร้างใหม่
          </NuxtLink>
        </div>
        <ChannelGrid :items="myChannels" />
        <div v-if="!myChannels?.length"
          class="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center text-[var(--muted)]">
          ยังไม่มีแชนแนลของคุณ — สร้างจากหน้า <NuxtLink to="/channel" class="underline hover:no-underline">จัดการแชนแนล
          </NuxtLink>
        </div>
      </section>
    </main>
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

const activeTab = ref<'all' | 'recommended' | 'mine'>('recommended')
const { isLoggedIn, token } = useSession()
const { public: { apiBase } } = useRuntimeConfig()

const pageErr = ref('')
const publicChannels = ref<Channel[]>([])
const myChannels = ref<Channel[]>([])

const totalCount = computed(() => publicChannels.value.length + (isLoggedIn.value ? myChannels.value.length : 0))

const segClass = (isActive: boolean) =>
  [
    'px-4 py-1.5 rounded-full text-sm font-medium transition',
    isActive
      ? 'bg-[var(--brand)] text-[var(--brand-contrast)]'
      : 'text-[var(--fg)] hover:brightness-95'
  ].join(' ')

const authHeaders = () => {
  const h: Record<string, string> = { Accept: 'application/json' }
  if (token.value) h.Authorization = `Bearer ${token.value}`
  return h
}

/** โหลด public จาก /channels/public/list/  */
const loadPublic = async () => {
  try {
    const res: any = await $fetch(`${apiBase}/channels/public/list/`, { method: 'GET' })
    publicChannels.value = Array.isArray(res)
      ? res.map((r: any) => ({
        id: r?.channels_id ?? r?.id,
        title: r?.title ?? 'Untitled',
        description: r?.description ?? null,
        created_at: r?.created_at ?? null,
        status: r?.status ?? 'public'
      }))
      : []
  } catch (e: any) {
    pageErr.value = e?.data?.detail || e?.message || 'โหลด Public Channels ไม่สำเร็จ'
  }
}

/** โหลดของฉัน (ต้องล็อกอิน) จาก /channels/list/ */
const loadMine = async () => {
  if (!isLoggedIn.value) { myChannels.value = []; return }
  try {
    const res: any = await $fetch(`${apiBase}/channels/list/`, {
      method: 'GET',
      headers: authHeaders(),
    })
    myChannels.value = Array.isArray(res)
      ? res.map((r: any) => ({
        id: r?.channels_id ?? r?.id,
        title: r?.title ?? 'Untitled',
        description: r?.description ?? null,
        created_at: r?.created_at ?? null,
        status: r?.status ?? '—'
      }))
      : []
  } catch (e: any) {
    pageErr.value = e?.data?.detail || e?.message || 'โหลดแชนแนลของฉันไม่สำเร็จ'
  }
}

onMounted(async () => {
  // ถ้าไม่ล็อกอิน ให้เริ่มที่แท็บ "แนะนำ"
  activeTab.value = isLoggedIn.value ? 'all' : 'recommended'
  await Promise.all([loadPublic(), loadMine()])
})

watch(isLoggedIn, async (v) => {
  activeTab.value = v ? 'all' : 'recommended'
  await loadMine()
})
</script>
