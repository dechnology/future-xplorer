<template>
  <CardButton
    class="mx-auto h-12 w-44 rounded-lg bg-lime-600 text-white hover:bg-lime-700"
    :disabled="aiDisabled"
    @click.prevent="() => handlePortraitGeneration()"
  >
    AI生成圖片
  </CardButton>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="handleCancel"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleSaveEdit"
    >
      儲存
    </CardButton>
  </div>
</template>

<script setup lang="ts">
// import { isEqual } from 'lodash';
import type { User, Persona } from '@/types';
import { NewPersonaSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  persona: usePersonaStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const {
  currentPersona,
  activePersona,
  activeId,
  imageFileBuffer,
  imageUrlBuffer,
  loading,
  aiDisabled,
} = storeToRefs(stores.persona);

const handlePortraitGeneration = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    const persona = NewPersonaSchema.parse(currentPersona.value);
    const token = await getTokenSilently();

    currentPersona.value.image = null;
    imageFileBuffer.value = null;
    imageUrlBuffer.value = null;

    stores.persona.aiPromptGeneration();
    console.log('generating portrait for persona: ', persona);
    const { err: errPrompt, prompt } = await generatePrompt(token, {
      workshop: workshop.value,
      issue: issue.value,
      persona,
    });
    console.log('prompt: ', prompt);
    if (errPrompt) {
      return stores.persona.aiPromptFailed();
    }

    stores.persona.aiAvatarGeneration();
    const { err: errImage, image } = await generateImage(token, { prompt });
    console.log('image: ', image);
    if (errImage) {
      return stores.persona.aiAvatarFailed();
    }

    imageFileBuffer.value = null;
    imageUrlBuffer.value = image;
  } catch (e) {
    console.error(e);
  }
};

const handleCancel = () => {
  stores.persona.changeActivePersona(activePersona.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    // if (isEqual(currentPersona.value, activePersona.value)) {
    //   state.value = 'DETAILS';
    //   return;
    // }

    const token = await getTokenSilently();
    const p = NewPersonaSchema.parse(currentPersona.value);

    if (imageUrlBuffer.value) {
      p.image = imageFileBuffer.value
        ? (await uploadImageFile(token, imageFileBuffer.value)).data
        : (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      console.log(`image url: ${p.image}`);
    }

    console.log('Patching: ', p);
    const { data: editedPersona } = await fetchResource<Persona>(
      token,
      `/api/personas/${activeId.value}`,
      { method: 'put', body: p }
    );

    editedPersona.creator = user.value as User;
    console.log('Patched: ', editedPersona);
    activePersona.value = editedPersona;
    stores.persona.changeActivePersona(editedPersona);
    stores.persona.upsertPersona(editedPersona);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
