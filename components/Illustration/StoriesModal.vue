<template>
  <dialog
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-4 focus:outline-slate-300 xl:p-16"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <div class="flex h-full flex-col gap-2">
      <div class="min-h-0 shrink grow flex-col gap-7 overflow-y-auto">
        <CardGallery :grid-cols="5">
          <Card
            v-for="el in stories"
            :key="el._id"
            :active="selectedStory?._id === el._id"
            class="min-h-[150px] xl:min-h-[305px]"
            @click="() => (selectedStory = el)"
          >
            <CardTitle>{{ el.title }}</CardTitle>
            <CardDescription :line-clamp="10">
              {{ el.content }}
            </CardDescription>
            <CardFootnote>
              {{ `建立者：${el.creator.name}` }}
            </CardFootnote>
          </Card>
        </CardGallery>
      </div>
      <div>
        <IllustrationStoriesModalActions @confirm="handelConfirm" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { Story } from '~/types';

const emit = defineEmits<{
  (e: 'confirm', storyContent: string): void;
}>();

const modal = ref<HTMLDialogElement | null>(null);
const stores = {
  modal: useModalStore(),
  story: useStoryStore(),
};
const { shown } = storeToRefs(stores.modal);
const { stories } = storeToRefs(stores.story);

const selectedStory = ref<Story>();

const handelConfirm = () => {
  if (selectedStory.value) {
    emit('confirm', selectedStory.value.content);
    selectedStory.value = undefined;
    stores.modal.close();
  }
};

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>
