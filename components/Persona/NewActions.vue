<template>
  <CardButton
    :disabled="aiDisabled"
    class="mx-auto h-12 w-44 rounded-lg bg-lime-600 text-white hover:bg-lime-700"
    @click.prevent="() => handlePortraitGeneration()"
  >
    AI生成圖片
  </CardButton>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="() => stores.persona.clearCurrentPersona()"
    >
      清除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleCreate"
    >
      新增
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import type { User, Persona } from '@/types';
import { NewPersonaSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  persona: usePersonaStore(),
};
const { workshop, issue, issueId } = storeToRefs(stores.issue);
const { currentPersona, imageFileBuffer, imageUrlBuffer, loading, aiDisabled } =
  storeToRefs(stores.persona);

const handlePortraitGeneration = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    const persona = NewPersonaSchema.parse(currentPersona.value);
    const token = await getTokenSilently();

    imageFileBuffer.value = null;
    imageUrlBuffer.value = null;

    stores.persona.aiPromptGeneration();
    console.log('generating portrait for persona: ', persona);
    const { prompt } = await generatePrompt(token, {
      workshop: workshop.value,
      issue: issue.value,
      persona,
    });
    console.log('prompt: ', prompt);

    stores.persona.aiAvatarGeneration();
    const { image } = await generateImage(token, { prompt });
    console.log('image: ', image);

    imageFileBuffer.value = null;
    imageUrlBuffer.value = image;
  } catch (e) {
    console.error(e);
  }
};

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!(issueId.value && issue.value)) {
      throw new Error('issue undefined');
    }

    const token = await getTokenSilently();
    const p = NewPersonaSchema.parse(currentPersona.value);

    if (imageUrlBuffer.value) {
      p.image = imageFileBuffer.value
        ? (await uploadImageFile(token, imageFileBuffer.value)).data
        : (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      console.log(`image url: ${p.image}`);
    }

    console.log('Creating: ', p);
    const { data: createdPersona } = await fetchResource<Persona>(
      token,
      `/api/issues/${issueId.value}/personas`,
      {
        method: 'post',
        body: p,
      }
    );
    createdPersona.creator = user.value as User;

    console.log('Created: ', createdPersona);
    stores.persona.upsertPersona(createdPersona);
    stores.persona.changeActivePersona(createdPersona);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
