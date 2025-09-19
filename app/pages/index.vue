<template>
  <div class="flex justify-between items-center">
    <div class="pt-4 top-0 left-0 p-4">
      <h1 class="text-5xl text-white font-bold">RAG</h1>
    </div>

    <div class="pt-4 top-0 right-0 p-4">
      <NuxtLink to="/login">
        <button type="button"
          class="bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
          <div class="flex items-center gap-2 text-white">
            <Icon name="line-md:login" class="w-6 h-6" />
            login
          </div>
        </button>
      </NuxtLink>
    </div>

    <UserMenu />
  </div>

  <div class="flex gap-6 p-4 text-[1.2rem] font-extrabold text-gray-100">
    <button @click="activeTab = 'all'"
      :class="activeTab === 'all' ? 'text-white bg-slate-500 rounded-full' : 'text-white'">
      <div class="cursor-pointer hover:bg-slate-800 p-3 rounded-full">
        ทั้งหมด
      </div>
    </button>

    <button @click="activeTab = 'recommended'"
      :class="activeTab === 'recommended' ? 'text-white bg-slate-500 rounded-full' : 'text-white'">
      <div class="cursor-pointer hover:bg-slate-800 p-3 rounded-full">
        แนะนำแชนแนล
      </div>
    </button>

    <button @click="activeTab = 'mine'"
      :class="activeTab === 'mine' ? 'text-white bg-slate-500 rounded-full' : 'text-white'">
      <div class="cursor-pointer hover:bg-slate-800 p-3 rounded-full">
        แชนแนลของฉัน
      </div>
    </button>
  </div>

  <div v-show="activeTab === 'all'">
    <div class="text-3xl font-bold text-white p-4">แชนแนลที่แนะนำ</div>
    <div class="mt-2 grid gap-4 grid-cols-5 p-4">
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 1
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 2
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 3
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
    </div>

    <div class="text-3xl font-bold text-white p-4">แชนแนลของฉัน</div>
    <div class="mt-2 grid gap-4 grid-cols-5 p-4">
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 4
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 5
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
    </div>
  </div>

  <div v-show="activeTab === 'recommended'">
    <div class="text-3xl font-bold text-white p-4">แชนแนลที่แนะนำ</div>
    <div class="mt-2 grid gap-4 grid-cols-5 p-4">
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 1
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 2
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 3
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
    </div>
  </div>

  <div v-show="activeTab === 'mine'">
    <div class="text-3xl font-bold text-white p-4">แชนแนลของฉัน</div>
    <div class="mt-2 grid gap-4 grid-cols-5 p-4">
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 4
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
      <a href="#">
        <div
          class="relative max-w-sm p-6 rounded-xl shadow-sm bg-slate-800 border-gray-200 hover:scale-105 transition-transform">
          <h2 class="mb-6 pr-12 text-2xl font-bold tracking-tight
                 text-gray-900 dark:text-white">
            แชนแนลที่ 5
          </h2>
        </div>
        <!-- <button class="">เพิ่มเติม</button> -->
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref<'all' | 'recommended' | 'mine'>('all')
</script>
