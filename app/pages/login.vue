<template>
    <div class="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <!-- Top bar -->
        <div class="top-0 right-0 p-4 justify-end flex">
            <NuxtLink to="/">
                <button type="button" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 border border-[var(--card-border)]
                 bg-[var(--card)] text-[var(--fg)] hover:brightness-95 focus:outline-none
                 focus:ring-2 focus:ring-[var(--focus-ring)] transition cursor-pointer">
                    <Icon name="line-md:home" class="w-5 h-5" />
                    <span>Home</span>
                </button>
            </NuxtLink>
        </div>

        <!-- Centered card -->
        <div class="px-4">
            <form
                class="max-w-md mx-auto mt-8 sm:mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-sm p-6"
                @submit.prevent="onSubmit">
                <!-- Header -->
                <div class="text-center mb-6">
                    <div
                        class="mx-auto w-12 h-12 rounded-xl grid place-items-center mb-3 border border-[var(--card-border)] bg-[var(--bg)]">
                        <Icon name="mdi:account-circle-outline" class="w-7 h-7" />
                    </div>
                    <h1 class="text-xl font-semibold">เข้าระบบด้วย ICIT Account</h1>
                    <p class="text-sm text-[var(--muted)] mt-1">กรอกบัญชีผู้ใช้และรหัสผ่านของคุณเพื่อดำเนินการต่อ</p>
                </div>

                <!-- ICIT Account -->
                <div class="mb-4">
                    <label for="icit-account" class="block text-sm mb-1">ICIT Account</label>
                    <input id="icit-account" v-model="form.account" type="text" required autocomplete="username"
                        placeholder="your.account" class="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)]
                   px-3 py-2 placeholder:text-[var(--muted)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" />
                </div>

                <!-- Password -->
                <div class="mb-2">
                    <label for="icit-password" class="block text-sm mb-1">Password</label>
                    <div class="relative">
                        <input id="icit-password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            required autocomplete="current-password" placeholder="••••••••" class="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)]
                     px-3 py-2 pr-10 placeholder:text-[var(--muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" />
                        <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center rounded-md
                     text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--bg)]/60 transition"
                            :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'" tabindex="-1">
                            <Icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Submit -->
                <div class="mt-5">
                    <button type="submit" :disabled="loading" class="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                   bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110 transition
                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-60">
                        <Icon name="mdi:login" class="w-5 h-5" />
                        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
                    </button>
                </div>

                <!-- Messages -->
                <p v-if="errorMsg" class="text-rose-600 text-sm mt-3 text-center">{{ errorMsg }}</p>
                <p v-if="okMsg" class="text-emerald-600 text-sm mt-3 text-center">{{ okMsg }}</p>
            </form>
        </div>
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
const showPassword = ref(false)

const onSubmit = async () => {
    errorMsg.value = ''
    okMsg.value = ''
    loading.value = true
    try {
        const res: any = await $fetch(`${apiBase}/auth/token`, {
            method: 'POST',
            body: new URLSearchParams({
                username: form.account,
                password: form.password,
                grant_type: 'password',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
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
    } finally {
        loading.value = false
    }
}
</script>
