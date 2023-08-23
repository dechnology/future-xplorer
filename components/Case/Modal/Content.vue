<template>
  <div v-if="activeCase">
    <InputTextarea
      inputClasses="h-fit"
      title="背景介紹"
      placeholder="案例背景"
      v-model="activeCase.background"
      :disabled="true"
    />
    <InputTextarea
      inputClasses="h-fit"
      title="作法"
      placeholder="案例作法"
      v-model="activeCase.method"
      :disabled="true"
    />
    <InputTextarea
      inputClasses="h-fit"
      title="目標"
      placeholder="案例目標"
      v-model="activeCase.goal"
      :disabled="true"
    />
    <InputTextarea
      inputClasses="h-fit"
      title="問題與挑戰"
      placeholder="案例的問題與挑戰"
      v-model="activeCase.challenge"
      :disabled="true"
    />
    <InputTextarea
      inputClasses="h-fit"
      title="成果"
      placeholder="成果"
      v-model="activeCase.result"
      :disabled="true"
    />
    <InputTextarea
      inputClasses="h-fit"
      title="其他"
      placeholder="其他"
      v-model="activeCase.other"
      :disabled="true"
    />
    <InputText
      title="參考資料"
      placeholder="參考資料"
      v-model="activeCase.reference"
      :disabled="true"
    />
    <div>
      <div class="overflow-hidden rounded-lg">
        <NuxtImg v-if="activeCase.image" :src="activeCase.image" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cardStore = useCaseCardStore();
const { activeCase } = storeToRefs(cardStore);
</script>
