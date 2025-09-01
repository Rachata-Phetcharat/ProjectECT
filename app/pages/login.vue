<template>
    <div class="mt-4 absolute top-0 right-0 p-4">
        <a href="/">
            <button type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Home
            </button>
        </a>
    </div>
    <div>
        <form action="assets/main.py" method="post"
            class="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
            <div class="text-center bg-neutral-500 text-white p-6 rounded-lg">
                <h1>เข้าระบบด้วย ICIT Account</h1>
            </div>
            <div class="mt-6">
                <h3>ICIT Account</h3>
                <input type="text" placeholder="" required
                    class="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full" />
                <h3>Password</h3>
                <input type="password" placeholder="" required
                    class="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full" />
                <div class="text-center">
                    <button type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        เข้าสู่ระบบ
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<style></style>
