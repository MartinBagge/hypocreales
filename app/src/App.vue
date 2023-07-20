<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue";

let openMenu = ref(false);
</script>

<template>
  <div class="flex items-center justify-center bg-black h-screen">
    <div
      class="w-[calc(100%-240px)] bg-[#FF0000] rounded-lg flex justify-center items-center absolute top-4"
    >
      <div class="flex items-center mt-2 mb-2">
        <button
          type="button"
          class="rounded-lg bg-black p-[1px] cursor-pointer text-white"
        >
          sfdgbhsgfpiughs
        </button>
        <button
          type="button"
          class="rounded-lg bg-black p-[1px] ml-4 cursor-pointer text-white"
        >
          sfdgbhsgfpiughs
        </button>
        <button
          type="button"
          class="rounded-lg bg-black p-[1px] ml-4 cursor-pointer text-white"
        >
          sfdgbhsgfpiughs
        </button>
        <button
          type="button"
          class="rounded-lg bg-black p-[1px] ml-4 cursor-pointer text-white"
        >
          sfdgbhsgfpiughs
        </button>
      </div>
      <div class="flex mt-2 mb-2 mr-4 right-0 absolute">
        <button type="button" class="rounded-lg green bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5">
            <!-- TODO: please fix svg -->
            <path
              d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
