<template>
  <ol
    v-if="items"
    ref="menu"
    class="absolute right-0 top-full z-10 mt-2 flex flex-col gap-2 rounded border border-solid border-gray-200 bg-white py-4 text-gray-500"
  >
    <li
      v-for="item in items"
      @click="$emit('itemClick', item)"
      class="cursor-pointer px-4 transition-all ease-in-out hover:bg-gray-200 hover:text-gray-700"
    >
      {{ item }}
    </li>
  </ol>
</template>

<script setup lang="ts">
interface Props {
  shown: boolean;
  items: string[];
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'itemClick', item: string): void;
  (e: 'closeMenu'): void;
}>();

const menu = ref<HTMLOListElement | null>(null);
const ignoreClick = ref(false);

const handleOutsideClick = (e: MouseEvent) => {
  if (ignoreClick.value) {
    ignoreClick.value = false;
    return;
  }

  if (props.shown && menu.value && !menu.value.contains(e.target as Node)) {
    emit('closeMenu');
  }
};

watch(
  () => props.shown,
  (newShown) => (ignoreClick.value = newShown)
);

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>
