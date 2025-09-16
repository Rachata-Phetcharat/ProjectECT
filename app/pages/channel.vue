<template>
    <div class="bg-slate-900 min-h-screen px-50">
        <div class="flex justify-between">
            <div class="m-4">
                <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" type="button"
                    class="bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-7 me-2 mb-2 focus:outline-none cursor-pointer">
                    <div class="flex items-center gap-2 text-white">
                        <Icon name="line-md:plus-square" class="w-6 h-6" />
                        สร้างแชนแนลใหม่
                    </div>
                </button>
            </div>

            <div id="crud-modal" tabindex="-1" aria-hidden="true"
                class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm bg-black/50">
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">

                        <div
                            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                สร้างแชนแนลใหม่
                            </h3>
                            <button type="button"
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                data-modal-toggle="crud-modal">
                                <Icon name="line-md:close" class="w-6 h-6" />
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form class="p-4 md:p-5" method="post">
                            <div class="grid gap-4 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="name"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อแชนแนล</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="" required>
                                </div>
                            </div>
                            <button type="submit"
                                class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 me-2">
                                ตกลง
                            </button>
                            <button type="reset"
                                class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                ล้างค่า
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="m-4">
                <button type="button" id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
                    class="bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
                    <div class="flex items-center gap-2 text-white">
                        <Icon name="line-md:account-small" class="w-6 h-6" />
                        รชต เพชรัตน์
                    </div>
                </button>
            </div>

            <div id="dropdownAvatarName"
                class="z-10 hidden bg-gray-800 hover:bg-gray-1 focus:ring-4 focus:ring-gray-300 w-44 rounded-lg">
                <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
                        <li>
                            <a href="/"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <Icon name="line-md:home" class="w-6 h-6" /> หน้าแรก
                            </a>
                        </li>
                        <li>
                            <a href="/channel"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <Icon name="line-md:plus-square" class="w-6 h-6" /> สร้างแชนแนลใหม่
                            </a>
                        </li>
                    </ul>
                    <hr>
                    <div class="py-2">
                        <a href="#"
                            class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                            <Icon name="line-md:log-out" class="w-6 h-6" />ออกจากระบบ
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="top-0 left-0 p-4">
            <form class="w-150" method="GET">
                <label for="default-search"
                    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search"
                        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Mockups, Logos..." required />
                    <button type="submit"
                        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">Search</button>
                </div>
            </form>
        </div>

        <div class="mt-2 grid gap-4 grid-cols-3 p-4">
            <h1 class="text-2xl font-extrabold text-gray-100">แชนแนลของฉัน</h1>
        </div>

        <div class="mt-2 grid gap-4 grid-cols-5 p-4">
            <a href="#">
                <div
                    class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
                    <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                   text-gray-900 dark:text-white">
                        แชนแนลที่ 1
                    </h2>

                    <button type="button" aria-label="Close"
                        class="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer">
                        <Icon name="line-md:close" class="w-5 h-5" />
                    </button>
                </div>
            </a>
            <a href="#">
                <div
                    class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
                    <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                   text-gray-900 dark:text-white">
                        แชนแนลที่ 2
                    </h2>

                    <button type="button" aria-label="Close"
                        class="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer">
                        <Icon name="line-md:close" class="w-5 h-5" />
                    </button>
                </div>
            </a>
            <a href="#">
                <div
                    class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
                    <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                   text-gray-900 dark:text-white">
                        แชนแนลที่ 3
                    </h2>

                    <button type="button" aria-label="Close"
                        class="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer">
                        <Icon name="line-md:close" class="w-5 h-5" />
                    </button>
                </div>
            </a>
            <a href="#">
                <div
                    class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
                    <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                   text-gray-900 dark:text-white">
                        แชนแนลที่ 4
                    </h2>

                    <button type="button" aria-label="Close"
                        class="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer">
                        <Icon name="line-md:close" class="w-5 h-5" />
                    </button>
                </div>
            </a>
            <a href="#">
                <div
                    class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
                    <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                   text-gray-900 dark:text-white">
                        แชนแนลที่ 5
                    </h2>

                    <button type="button" aria-label="Close"
                        class="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer">
                        <Icon name="line-md:close" class="w-5 h-5" />
                    </button>
                </div>
            </a>
        </div>
    </div>
</template>