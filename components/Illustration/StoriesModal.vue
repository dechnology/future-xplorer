<template>
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
    <IllustrationStoriesModalActions @confirm="handelConfirm" />
  </div>
</template>

<script setup lang="ts">
import { Story } from '~/types';

const modal = ref<HTMLDialogElement | null>(null);
const stores = {
  modal: useModalStore(),
  story: useStoryStore(),
  illustration: useIllustrationStore(),
};
const { shown } = storeToRefs(stores.modal);
const { stories } = storeToRefs(stores.story);
const { currentIllustration } = storeToRefs(stores.illustration);

const selectedStory = ref<Story>();

const handelConfirm = () => {
  if (selectedStory.value) {
    currentIllustration.value.story = selectedStory.value.content;
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
