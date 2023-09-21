<template>
  <div
    v-if="activePersona"
    ref="contentDiv"
    class="relative flex min-h-0 shrink grow basis-auto flex-col gap-6"
  >
    <div class="flex flex-col gap-6">
      <slot :content="activePersonaContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface PersonaContent {
  角色: string;
  姓名: string;
  年齡: string;
  性別: string;
  特徵: string;
  其他: string;
}

const stores = {
  persona: usePersonaStore(),
  modal: useModalStore(),
};
const { activePersona } = storeToRefs(stores.persona);

const activePersonaContent = computed(
  (): PersonaContent =>
    activePersona.value
      ? {
          角色: activePersona.value.role,
          姓名: activePersona.value.name,
          年齡: activePersona.value.age,
          性別: activePersona.value.gender,
          特徵: activePersona.value.trait,
          其他: activePersona.value.other,
        }
      : {
          角色: '',
          姓名: '',
          年齡: '',
          性別: '',
          特徵: '',
          其他: '',
        }
);

const contentDiv = ref<HTMLDivElement | null>(null);
</script>
