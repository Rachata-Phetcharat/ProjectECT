<template>
    <div class="mt-4 absolute top-0 right-0 p-4">
        <a href="/">
            <button type="button"
                class="bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
                <div class="flex items-center gap-2 text-white">
                    <Icon name="line-md:home" class="w-6 h-6" />
                    Home
                </div>

            </button>
        </a>
    </div>
    <div>
        <form action="assets/main.py" method="post"
            class="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
            <div class="text-center bg-gray-800 text-white p-6 rounded-lg">
                <h1>เข้าระบบด้วย ICIT Account</h1>
            </div>
            <div class="mt-6">
                <h3>ICIT Account</h3>
                <input type="text" placeholder="" required
                    class="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full" />
                <!-- <h3>Password</h3>
                <input type="password" placeholder="" required
                    class="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full" /> -->
                <div class="text-center">
                    <button type="submit"
                        class="bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
                        <div class="flex items-center gap-2 text-white">
                            <Icon name="mdi:login" class=" w-6 h-6" />
                            เข้าสู่ระบบ
                        </div>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<style></style>
