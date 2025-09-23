<template>
    <div class="top-0 right-0 p-4 justify-end flex">
        <NuxtLink to="/">
            <button type="button"
                class="bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
                <div class="flex items-center gap-2 text-white">
                    <Icon name="line-md:home" class="w-6 h-6" /> Home
                </div>
            </button>
        </NuxtLink>
    </div>

    <div>
        <form class="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md" @submit.prevent="onSubmit">
            <div class="text-center bg-slate-600 text-white p-6 rounded-t-lg">
                <h1>เข้าระบบด้วย ICIT Account</h1>
            </div>

            <div class="mt-6">
                <h3>ICIT Account</h3>
                <input v-model="form.account" type="text" required autocomplete="username"
                    class="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full" />
                <h3>Password</h3>
                <input v-model="form.password" type="password" required autocomplete="current-password"
                    class="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full" />

                <div class="text-center">
                    <button type="submit" :disabled="loading" class="bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg
                   text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer disabled:opacity-60">
                        <div class="flex items-center gap-2 text-white">
                            <Icon name="mdi:login" class="w-6 h-6" />
                            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
                        </div>
                    </button>
                </div>

                <p v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">{{ errorMsg }}</p>
                <p v-if="okMsg" class="text-emerald-400 text-sm mt-2 text-center">{{ okMsg }}</p>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'plain' })

const { public: { apiBase } } = useRuntimeConfig()
const router = useRouter()
const { setLoggedIn, fetchMe, setToken } = useSession()

const form = reactive({ account: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')
const okMsg = ref('')

const onSubmit = async () => {
    errorMsg.value = ''; okMsg.value = ''; loading.value = true
    try {
        const res: any = await $fetch(`${apiBase}/auth/token`, {
            method: 'POST',
            body: new URLSearchParams({
                username: form.account,
                password: form.password,
                grant_type: 'password',
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        })
        const accessToken = res?.access_token || res?.token || (typeof res === 'string' ? res : null)
        if (!accessToken) throw new Error('ไม่พบ access token จากเซิร์ฟเวอร์')

        setToken(accessToken)
        await fetchMe()
        setLoggedIn(true)
        router.push((router.currentRoute.value.query.redirect as string) || '/')
    } catch (e: any) {
        setLoggedIn(false)
        errorMsg.value = e?.data?.detail || e?.message || 'เข้าสู่ระบบไม่สำเร็จ'
    } finally { loading.value = false }
}
</script>
