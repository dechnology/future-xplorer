<template>
  <CardButton
    class="px- mx-auto rounded-lg bg-lime-600 px-8 text-white"
    :class="!formDisabled && 'hover:bg-lime-700'"
    :disabled="formDisabled"
    @click.prevent="() => handlePortraitGeneration()"
  >
    AI生成圖片
  </CardButton>
  <div class="flex items-center justify-around">
    <CardButton
      class="px- rounded-lg bg-red-400 px-8 text-white"
      :class="!formDisabled && 'hover:bg-red-500'"
      :disabled="formDisabled"
      @click.prevent="() => stores.persona.resetForm()"
    >
      清除
    </CardButton>
    <CardButton
      class="px- rounded-lg bg-indigo-500 px-8 text-white"
      :class="!formDisabled && 'hover:bg-indigo-600'"
      :disabled="formDisabled"
      @click.prevent="handleCreate"
    >
      新增
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import type { Persona } from '@/types';
import { NewPersonaSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  persona: usePersonaStore(),
};
const { workshop, issue, issueId } = storeToRefs(stores.issue);
const {
  currentPersona,
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

    imageFile.value = null;
    imageUrl.value = null;

    const el = NewPersonaSchema.parse(currentPersona.value);
    let token = await getTokenSilently();
    console.log('Generating prompt for persona: ', el);
    imageState.value = 'PROMPTING';
    const { prompt } = await generatePortraitPrompt(token, {
      workshop: workshop.value,
      issue: issue.value,
      persona: el,
    });
    console.log('prompt: ', prompt);

    imageState.value = 'GENERATING';
    token = await getTokenSilently();
    const { image } = await generateImage(token, { prompt });
    console.log('image: ', image);

    imageUrl.value = image;
    imageState.value = 'IDLE';
  } catch (e) {
    imageState.value = 'ERROR';
    console.error(e);
  }
};

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!(issueId.value && issue.value)) {
      throw new Error('issue undefined');
    }

    let token = await getTokenSilently();
    const el = NewPersonaSchema.parse(currentPersona.value);
    const { data: uploadedUrl } = await uploadImageToS3(
      token,
      imageUrl.value,
      imageFile.value
    );
    el.image = uploadedUrl;

    console.log('Creating: ', el);
    token = await getTokenSilently();
    const { data: createdPersona } = await fetchResource<Persona>(
      token,
      `/api/issues/${issueId.value}/personas`,
      {
        method: 'post',
        body: el,
      }
    );
    console.log('Created: ', createdPersona);

    token = await getTokenSilently();
    stores.persona.update(token);
    stores.persona.resetForm();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
