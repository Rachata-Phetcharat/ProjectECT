<template>
  <div class="mt-4 absolute top-0 right-0 p-4">
    <a href="/login">
      <button type="button"
        class="bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
        <div class="flex items-center gap-2 text-white">
          <Icon name="line-md:login" class="w-6 h-6" />
          login
        </div>
      </button>
    </a>
  </div>

  <div class="mt-20 absolute top-0 right-0 p-4">
    <button type="button" id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
      class="bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer">
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

</template>

<style></style>
