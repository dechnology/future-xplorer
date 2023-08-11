<template>
  <div class="m-auto flex w-1/3 items-center justify-center gap-8">
    <InputText
      class="w-full"
      v-model="val1"
      title="Test"
      placeholder="Test"
      :select-options="options"
    />
    <!-- <InputText
      class="w-full"
      v-model="val2"
      title="Test"
      placeholder="Test"
      :select-options="options"
      select-only
    /> -->
  </div>
</template>

<script setup lang="ts">
const val1 = ref('');
const val2 = ref('');
const options = [
  '選項一',
  '很長的選項lololololololololololololol',
  '選項三或什麼的我不知道',
];
</script>
