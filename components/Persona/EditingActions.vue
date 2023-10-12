<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="mx-auto rounded-lg bg-lime-600 px-8 text-white"
      :class="!loading && 'hover:bg-lime-700'"
      :disabled="loading"
      @click.prevent="() => handlePortraitGeneration()"
    >
      <span class="py-3"> AI生成圖片 </span>
    </CardButton>
  </div>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 text-white"
      :class="!loading && 'hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="() => stores.persona.resetForm()"
    >
      <span class="py-3"> 取消 </span>
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 text-white"
      :class="!loading && 'hover:bg-indigo-600'"
      :disabled="loading"
      @click.prevent="handleSaveEdit"
    >
      <span class="py-3"> 儲存 </span>
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import isEqual from 'lodash/isEqual';
import type { Persona } from '@/types';
import { NewPersonaSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  persona: usePersonaStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const {
  currentPersona,
  activePersona,
  activeId,
  state,
  imageState,
  imageFile,
  imageUrl,
  loading,
  formDisabled,
} = storeToRefs(stores.persona);

const handlePortraitGeneration = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    const token = await getTokenSilently();
    const persona = NewPersonaSchema.parse(currentPersona.value);

    imageFile.value = null;
    imageUrl.value = null;

    console.log('Generating prompt for persona: ', persona);
    imageState.value = 'PROMPTING';
    const { prompt } = await generatePortraitPrompt(token, {
      workshop: workshop.value,
      issue: issue.value,
      persona,
    });
    console.log('prompt: ', prompt);

    imageState.value = 'GENERATING';
    const { image } = await generateImage(token, { prompt });
    console.log('image: ', image);

    imageUrl.value = image;
    imageState.value = 'IDLE';
  } catch (e) {
    imageState.value = 'ERROR';
    console.error(e);
  }
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (isEqual(currentPersona.value, activePersona.value)) {
      state.value = 'DETAILS';
      return;
    }

    let token = await getTokenSilently();
    const el = NewPersonaSchema.parse(currentPersona.value);
    const { data: uploadedUrl } = await uploadImageToS3(
      token,
      imageUrl.value,
      imageFile.value
    );
    el.image = uploadedUrl;

    // if (imageUrl.value) {
    //   el.image = imageFile.value
    //     ? (await uploadImageFile(token, imageFile.value)).data
    //     : (await uploadImageUrl(token, imageUrl.value)).data;
    //   console.log(`image url: ${el.image}`);
    // }

    console.log('Patching: ', el);
    token = await getTokenSilently();
    const { data: editedPersona } = await fetchResource<Persona>(
      token,
      `/api/personas/${activeId.value}`,
      { method: 'put', body: el }
    );
    console.log('Patched: ', editedPersona);

    token = await getTokenSilently();
    stores.persona.update(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
