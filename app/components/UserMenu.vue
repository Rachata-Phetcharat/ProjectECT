<template>
    <div class="relative">
        <button id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
            class="bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
            <div class="flex items-center gap-2 text-white">
                <Icon name="line-md:account-small" class="w-6 h-6" />
                {{ displayName }}
            </div>
        </button>

        <div id="dropdownAvatarName" class="z-10 hidden bg-gray-800 w-44 rounded-lg divide-y divide-gray-700 shadow">
            <div class="px-4 py-3 text-sm text-gray-200">
                <div class="font-medium truncate">{{ displayName }}</div>
            </div>
            <ul class="py-2 text-sm text-gray-200">
                <li>
                    <NuxtLink to="/" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700">
                        <Icon name="line-md:home" class="w-5 h-5" /> หน้าแรก
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/channel" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700">
                        <Icon name="line-md:plus-square" class="w-5 h-5" /> สร้างแชนแนลใหม่
                    </NuxtLink>
                </li>
            </ul>
            <div class="py-2">
                <button type="button" @click="onLogout"
                    class="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-700 cursor-pointer text-sm text-gray-200">
                    <Icon name="line-md:log-out" class="w-5 h-5" /> ออกจากระบบ
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { user, setLoggedIn, setToken, authHeaders } = useSession()
const { public: { apiBase } } = useRuntimeConfig()
const router = useRouter()
const displayName = computed(() => user.value?.name || 'ผู้ใช้')

const onLogout = async () => {
    try { await $fetch(`${apiBase}/auth/logout`, { method: 'POST', headers: authHeaders() }).catch(() => { }) }
    finally { setToken(null); setLoggedIn(false); router.push('/') }
}
</script>
