<template>
  <div class="min-h-[100dvh] bg-[var(--bg)] text-[var(--fg)]">
    <!-- ================= Header ================= -->
    <header class="border-b border-[var(--card-border)] bg-[var(--bg)]/90 backdrop-blur">
      <div class="mx-auto py-4 flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div class="truncate">
            <h1 class="text-xl sm:text-2xl font-bold leading-tight">RAG</h1>
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
            <span class="mx-1">•</span>
            ของฉัน {{ myChannels.length }}
            <template v-if="isAdmin">
              <span class="mx-1">•</span>
              ของผู้อื่น {{ otherChannels.length }}
            </template>
          </template>
        </div>

        <div class="inline-flex items-center gap-2">
          <template v-if="isLoggedIn">
            <div class="inline-flex rounded-full border border-[var(--card-border)] bg-[var(--card)] p-1">
              <button :class="segClass(activeTab === 'all')" @click="activeTab = 'all'">
                ทั้งหมด
              </button>

              <button :class="segClass(activeTab === 'mine')" @click="activeTab = 'mine'">
                ของฉัน
              </button>

              <button :class="segClass(activeTab === 'public')" @click="activeTab = 'public'">
                สาธารณะ
              </button>

              <button v-if="isAdmin" :class="segClass(activeTab === 'other')" @click="activeTab = 'other'">
                ผู้ใช้อื่น
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- ============== Error line ============== -->
    <div v-if="pageErr" class="mx-auto max-w-7xl px-6 pt-3 text-sm text-rose-600">
      {{ pageErr }}
    </div>

    <!-- ============== Content ============== -->
    <main class="mx-auto py-6">
      <!-- All -->
      <section v-if="isLoggedIn" v-show="activeTab === 'all'">
        <div class="mb-3">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลสาธารณะ</h2>
        </div>
        <ChannelGrid :items="publicChannels" />

        <div class="mt-10 flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลของฉัน</h2>
          <NuxtLink to="/channel" class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border border-[var(--card-border)] bg-[var(--card)]
                   hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
            <Icon name="line-md:plus" class="w-4 h-4" />
            จัดการ/สร้างใหม่
          </NuxtLink>
        </div>
        <ChannelGrid :items="myChannels" />
        <!-- <div v-if="!myChannels?.length"
          class="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center text-[var(--muted)]">
          ยังไม่มีแชนแนลของคุณ — สร้างจากหน้า
          <NuxtLink to="/channel" class="underline hover:no-underline">
            จัดการแชนแนล
          </NuxtLink>
        </div> -->

        <!-- แชนแนลของผู้ใช้อื่น (เฉพาะ admin) -->
        <section v-if="isAdmin" class="mt-10">
          <div class="mb-3">
            <h2 class="text-xl sm:text-2xl font-bold">แชนแนลของผู้ใช้อื่น</h2>
          </div>
          <ChannelGrid :items="otherChannels" />
        </section>
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
      </section>

      <!-- Public -->
      <section v-show="activeTab === 'public'">
        <div class="mb-3">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลที่แนะนำ</h2>
        </div>
        <ChannelGrid :items="publicChannels" />
      </section>

      <!-- Other -->
      <section v-if="isAdmin" v-show="activeTab === 'other'">
        <div class="mb-3">
          <h2 class="text-xl sm:text-2xl font-bold">แชนแนลของผู้ใช้อื่น</h2>
        </div>
        <ChannelGrid :items="otherChannels" />
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
  owner_id?: string | number | null
  owner_name?: string | null
}

const activeTab = ref<'all' | 'public' | 'mine' | 'other'>('public')

const { isLoggedIn, token, role, me, checkSession } = useSession()
const { public: { apiBase } } = useRuntimeConfig()

const pageErr = ref('')
const publicChannels = ref<Channel[]>([])
const myChannels = ref<Channel[]>([])
const otherChannels = ref<Channel[]>([])

// ⭐ ทำ isAdmin ให้รองรับทุกแบบ และ log ดู role จริงๆ
const isAdmin = computed(() => {
  const r = (role.value ?? '').toString().toLowerCase()
  return ['admin', 'high-admin', 'superadmin', 'staff', '1'].includes(r)
})

watch([role, me], () => {
  console.log('DEBUG session:', {
    role: role.value,
    isAdmin: isAdmin.value,
    me: me.value,
  })
})

const totalCount = computed(
  () =>
    publicChannels.value.length +
    (isLoggedIn.value
      ? myChannels.value.length +
      (isAdmin.value ? otherChannels.value.length : 0)
      : 0)
)

const segClass = (isActive: boolean) =>
  [
    'px-4 py-1.5 rounded-full text-sm font-medium transition',
    isActive
      ? 'bg-[var(--brand)] text-[var(--brand-contrast)]'
      : 'text-[var(--fg)] hover:brightness-95',
  ].join(' ')

const authHeaders = () => {
  const h: Record<string, string> = { Accept: 'application/json' }
  if (token.value) h.Authorization = `Bearer ${token.value}`
  return h
}

/** โหลด public จาก /channels/public/list/  */
const loadPublic = async () => {
  try {
    const res: any = await $fetch(`${apiBase}/channels/public/list/`, {
      method: 'GET',
    })
    console.log('DEBUG public res:', res)

    publicChannels.value = Array.isArray(res)
      ? res.map((r: any) => ({
        id: r?.channels_id ?? r?.id,
        title: r?.title ?? 'Untitled',
        description: r?.description ?? null,
        created_at: r?.created_at ?? null,
        status: r?.status ?? 'public',
        // เผื่อ backend ส่ง owner_id หรือ created_by หรือ user_id
        owner_id: r?.created_by,
        owner_name: r?.owner_name ?? r?.owner ?? null,
      }))
      : []
  } catch (e: any) {
    pageErr.value =
      e?.data?.detail || e?.message || 'โหลด Public Channels ไม่สำเร็จ'
  }
}

const loadMine = async () => {
  if (!isLoggedIn.value) {
    myChannels.value = []
    otherChannels.value = []
    return
  }

  try {
    // 1) ดึง "ของฉัน" จาก /channels/list/ (ให้ backend ตัดสิน)
    const mineRes: any = await $fetch(`${apiBase}/channels/list/`, {
      method: 'GET',
      headers: authHeaders(),
    })

    const mapChannel = (r: any): Channel => ({
      id: r?.channels_id ?? r?.id,
      title: r?.title ?? 'Untitled',
      description: r?.description ?? null,
      created_at: r?.created_at ?? null,
      status: r?.status ?? '—',
      // เผื่ออนาคตอยากใช้เพิ่ม
      owner_id: r?.created_by ?? r?.owner_id ?? null,
      owner_name: r?.owner_name ?? r?.owner ?? null,
    })

    const mineMapped: Channel[] = Array.isArray(mineRes)
      ? mineRes.map(mapChannel)
      : []

    myChannels.value = mineMapped

    // 2) ถ้าไม่ใช่ admin ก็จบแค่นี้
    if (!isAdmin.value) {
      otherChannels.value = []
      return
    }

    // 3) ถ้าเป็น admin → ดึง "ทั้งหมด" จาก /channels/list/all/
    const allRes: any = await $fetch(`${apiBase}/channels/list/all/`, {
      method: 'GET',
      headers: authHeaders(),
    })

    const allMapped: Channel[] = Array.isArray(allRes)
      ? allRes.map(mapChannel)
      : []

    // 4) otherChannels = all - mine (เทียบจาก id)
    const myIds = new Set(mineMapped.map(ch => String(ch.id)))
    otherChannels.value = allMapped.filter(
      ch => !myIds.has(String(ch.id))
    )
  } catch (e: any) {
    pageErr.value =
      e?.data?.detail || e?.message || 'โหลดแชนแนลของฉันไม่สำเร็จ'
  }
}

onMounted(async () => {
  if (isLoggedIn.value) {
    await checkSession()
  }

  activeTab.value = isLoggedIn.value ? 'all' : 'public'
  await Promise.all([loadPublic(), loadMine()])
})

watch(isLoggedIn, async (v) => {
  if (v) {
    await checkSession()
  }
  activeTab.value = v ? 'all' : 'public'
  await loadMine()
})
</script>
