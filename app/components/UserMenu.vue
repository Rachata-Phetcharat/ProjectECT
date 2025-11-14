<template>
    <div class="relative">
        <!-- Trigger -->
        <button ref="btn" @click="toggle" type="button" class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer
                   border border-[var(--card-border)] bg-[var(--card)] text-[var(--fg)]
                   hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition">
            <Icon name="line-md:account-small" class="w-5 h-5" />
            <span class="truncate max-w-[10rem]">{{ displayName }}</span>
            <Icon name="lucide:chevron-down" class="w-4 h-4 opacity-70 transition-transform duration-200"
                :class="open ? 'rotate-180' : ''" />
        </button>

        <!-- Teleport dropdown ไป body เพื่อหนี stacking context ทั้งหมด -->
        <teleport to="body">
            <!-- Backdrop สำหรับคลิกปิด -->
            <div v-if="open" class="fixed inset-0 z-[200]" @pointerdown="onBackdropClick"></div>

            <!-- Dropdown -->
            <div v-if="open" ref="menu" :style="menuStyle" class="fixed z-[201] w-64 overflow-hidden rounded-xl
                       border border-[var(--card-border)] bg-[var(--card)] text-[var(--fg)] shadow-xl">
                <!-- ลูกศรชี้ปุ่ม -->
                <div class="absolute -top-2 right-4 w-3 h-3 rotate-45
                           bg-[var(--card)] border-t border-l border-[var(--card-border)]"></div>

                <div class="px-4 pt-4 pb-3 text-sm">
                    <div class="font-medium truncate">{{ displayName }}</div>
                </div>
                <div class="border-t border-[var(--card-border)]"></div>

                <!-- เมนูหลัก -->
                <nav class="py-1 text-sm">
                    <NuxtLink to="/" class="flex items-center gap-2 px-4 py-2 hover:bg-black/5" @click="close">
                        <Icon name="line-md:home" class="w-5 h-5" /> หน้าแรก
                    </NuxtLink>

                    <NuxtLink to="/channel" class="flex items-center gap-2 px-4 py-2 hover:bg-black/5" @click="close">
                        <Icon name="line-md:plus-square" class="w-5 h-5" /> สร้างแชนแนลใหม่
                    </NuxtLink>
                </nav>

                <!-- เส้นคั่น -->
                <div class="border-t border-[var(--card-border)]"></div>

                <!-- ส่วนเลือกธีม -->
                <div class="px-4 py-3 text-sm">
                    <div class="text-xs font-semibold uppercase text-[var(--muted)] mb-2">
                        ธีมสี (Appearance)
                    </div>

                    <div class="flex items-center justify-between gap-3">
                        <!-- ฝั่งข้อความ -->
                        <div class="flex flex-col">
                            <span class="text-sm font-medium">
                                {{ isDark ? "โหมดมืด" : "โหมดสว่าง" }}
                            </span>
                            <span class="text-xs text-[var(--muted)]">
                                สลับระหว่างธีมสว่างและมืด
                            </span>
                        </div>

                        <!-- Toggle -->
                        <button type="button" @click="toggleTheme" class="relative inline-flex h-7 w-12 items-center rounded-full transition
                                   border border-[var(--card-border)]
                                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                            :class="isDark ? 'bg-[var(--brand)]/80' : 'bg-[var(--card)]'">
                            <div class="absolute inset-0 flex items-center justify-between px-1 text-[10px]">
                                <span v-if="!isDark">🌞</span>
                                <span v-else class="ml-auto">🌙</span>
                            </div>

                            <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow
                                       transition-transform duration-200"
                                :class="isDark ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                    </div>
                </div>

                <!-- เส้นคั่น -->
                <div class="border-t border-[var(--card-border)]"></div>

                <!-- ปุ่มออกจากระบบ -->
                <button type="button"
                    class="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-black/5 cursor-pointer text-sm text-red-500"
                    @click="onLogout">
                    <Icon name="line-md:log-out" class="w-5 h-5" /> ออกจากระบบ
                </button>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
const { user, setLoggedIn, setToken, authHeaders } = useSession();
const {
    public: { apiBase },
} = useRuntimeConfig();
const router = useRouter();

// 👉 ใช้ composable ธีม
const { theme, setTheme } = useTheme();

const displayName = computed(() => user.value?.name || 'ผู้ใช้')

const open = ref(false)
const btn = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})

const MENU_W = 256 // w-64

function computePosition() {
    const b = btn.value?.getBoundingClientRect()
    if (!b) return
    const margin = 8
    const top = b.bottom + window.scrollY + margin
    let left = b.right + window.scrollX - MENU_W
    const maxLeft =
        window.scrollX + document.documentElement.clientWidth - MENU_W - margin
    const minLeft = window.scrollX + margin
    left = Math.max(minLeft, Math.min(left, maxLeft))
    menuStyle.value = { top: `${top}px`, left: `${left}px` }
}

function toggle() {
    open.value = !open.value
    if (open.value) {
        computePosition()
        window.addEventListener('scroll', computePosition, { passive: true })
        window.addEventListener('resize', computePosition)
        document.addEventListener('keydown', onEsc)
    } else {
        cleanup()
    }
}

function close() {
    open.value = false
    cleanup()
}

function onBackdropClick(e: PointerEvent) {
    if (!menu.value?.contains(e.target as Node) && !btn.value?.contains(e.target as Node))
        close()
}

function onEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
}

function cleanup() {
    window.removeEventListener('scroll', computePosition)
    window.removeEventListener('resize', computePosition)
    document.removeEventListener('keydown', onEsc)
}

onBeforeUnmount(cleanup)

// ====== Theme Toggle ======
const isDark = computed(() => theme.value === "dark");

const toggleTheme = () => {
    const next = isDark.value ? "light" : "dark";
    setTheme(next); // แค่เรียกอันนี้พอ
};

// ====== Logout ======
const onLogout = async () => {
    try {
        await $fetch(`${apiBase}/auth/logout`, {
            method: "POST",
            headers: authHeaders(),
        }).catch(() => { });
    } finally {
        // 1) เคลียร์ session ก่อน
        setToken(null);
        setLoggedIn(false);

        // 2) ตอนนี้ currentUserKey = null แล้ว → theme จะถูกเซฟใน theme:guest
        setTheme("light"); // เปลี่ยนหน้าเป็นธีมขาวทันที

        router.push("/");
        close();
    }
};

</script>
