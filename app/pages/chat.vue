<template>
    <div class="bg-slate-900 min-h-screen flex flex-col">

        <div class="px-10 py-2 flex justify-between items-center bg-slate-900">
            <div class="pt-2">
                <input type="text" placeholder="Kerberos Authentication Explained: A Five-Minute Cyber Guide"
                    class="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-[48rem] max-w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <UserMenu />
        </div>

        <div class="flex flex-1 gap-4 px-10 py-4 overflow-hidden">
            <div class="bg-slate-600 rounded-lg p-4 basis-1/4 overflow-auto">
                <div class="text-white font-bold text-lg mb-4">
                    แหล่งข้อมูล
                </div>
                <hr class="border-gray-400" />
                <div>
                    <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" type="button"
                        class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 mt-4 cursor-pointer">
                        เพิ่มแหล่งข้อมูล
                    </button>

                    <div id="crud-modal" tabindex="-1" aria-hidden="true"
                        :class="['fixed inset-0 z-50 justify-center items-center w-full h-full backdrop-blur-sm bg-black/50', isModalOpen ? 'flex' : 'hidden']">

                        <div class="relative p-4 w-full max-w-5xl max-h-full">
                            <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                <div
                                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        อัปโหลดไฟล์
                                    </h3>
                                    <button type="button"
                                        class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                        data-modal-toggle="crud-modal">
                                        <Icon name="line-md:close" class="w-6 h-6" />
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>

                                <form class="p-4 md:p-5" method="post">
                                    <div class="grid gap-4 mb-4 grid-cols-2">
                                        <div class="col-span-2">
                                            <div class="flex items-center justify-center w-full">
                                                <label for="dropzone-file"
                                                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-100">
                                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                            fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" stroke-linecap="round"
                                                                stroke-linejoin="round" stroke-width="2"
                                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                        </svg>
                                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span class="font-semibold">Click to upload</span> or drag
                                                            and drop
                                                        </p>
                                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                                            รองรับ PDF
                                                        </p>
                                                    </div>
                                                    <input id="dropzone-file" type="file" class="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"
                                        class="cursor-pointer text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2">
                                        อัปโหลด
                                    </button>
                                    <button type="reset"
                                        class="cursor-pointer text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
                                        ล้างค่า
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <ul class="mt-4 space-y-2">
                        <li>
                            <div
                                class="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
                                <Icon name="line-md:file-document" class="w-6 h-6 me-3" />
                                <span class="flex-1 whitespace-nowrap">Document1.pdf</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="bg-slate-600 rounded-lg p-4 flex-1 flex flex-col">
                <div class="text-white font-bold text-lg mb-4">
                    แชท
                </div>
                <hr class="border-gray-400" />
                <div class="mt-4 px-8">
                    <div class="space-y-4">
                        <div class="space-y-4 h-[73vh] overflow-y-auto pr-2">
                            <div class="flex justify-start">
                                <div class="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
                                    สวัสดี! ฉันสามารถช่วยอะไรคุณได้บ้าง?
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                    สวัสดี! คุณช่วยอธิบายเกี่ยวกับการพิสูจน์ตัวตน Kerberos ได้ไหม?
                                </div>
                            </div>
                            <div class="flex justify-start">
                                <div class="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
                                    แน่นอน! Kerberos
                                    เป็นโปรโตคอลการพิสูจน์ตัวตนที่ใช้ตั๋วเพื่ออนุญาตให้ผู้ใช้และบริการสื่อสารกันอย่างปลอดภัยผ่านเครือข่ายที่ไม่ปลอดภัย
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                    ขอบคุณสำหรับคำอธิบาย! มันช่วยได้มาก
                                </div>
                            </div>
                            <div class="flex justify-start">
                                <div class="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
                                    ยินดีครับ! หากคุณมีคำถามเพิ่มเติม อย่าลังเลที่จะถามนะครับ
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                    แน่นอนครับ ขอบคุณมาก!
                                </div>
                            </div>
                            <div class="flex justify-start">
                                <div class="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
                                    ด้วยความยินดีครับ!
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                    ขอบคุณครับ!
                                </div>
                            </div>
                            <div class="flex justify-start">
                                <div class="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
                                    ยินดีครับ!
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                    ขอบคุณครับ!
                                </div>
                            </div>
                        </div>
                    </div>

                    <form method="post">
                        <div class="mt-4 flex gap-2 items-center">
                            <div class="flex-1">
                                <input type="text" placeholder="พิมพ์ข้อความ..."
                                    class="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button type="submit"
                                class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer">
                                ส่ง
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
    layout: 'plain'
})

const isModalOpen = ref(false)

// Optional: Add event listeners for modal open/close if needed
</script>
