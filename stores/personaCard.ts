import { fakerZH_TW } from '@faker-js/faker';
import { CardStates, NewPersonaSchema, personaPresets } from '@/types';
import type {
  Persona,
  NewPersona,
  CardState,
  PortraitRequestBody,
  ResourceObject,
} from '@/types';
import { AsyncData } from 'nuxt/app';

const getNewPersona = (): NewPersona => ({
  role: '',
  name: '',
  age: '',
  trait: '',
  gender: 'male',
  other: '',
});

const getRandomNewPersona = (): NewPersona => ({
  role: fakerZH_TW.helpers.arrayElement(personaPresets.role),
  name: fakerZH_TW.person.fullName(),
  age: fakerZH_TW.helpers.arrayElement(personaPresets.age),
  trait: fakerZH_TW.helpers.arrayElement(personaPresets.trait),
  gender: fakerZH_TW.helpers.arrayElement(personaPresets.gender),
  other: '',
});

export const usePersonaCardStore = definePiniaStore('persona card', () => {
  const currentPersona = ref<Persona | NewPersona>(getNewPersona());
  const imageBuffer = ref<string | null>(null);
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);
  const loading = ref(false);

  function clearCurrentPersona() {
    currentPersona.value = getNewPersona();
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function setCurrentPersona(p: Persona) {
    currentPersona.value = { ...p };
  }

  function setActiveId(id: string) {
    activeId.value = id;
  }

  function randomizeCurrentPersona() {
    currentPersona.value = getRandomNewPersona();
  }

  async function generatePortrait(
    token: string,
    body: Omit<PortraitRequestBody, 'persona'>
  ) {
    const persona = NewPersonaSchema.parse(currentPersona.value);
    console.log('generating portrait for persona: ', persona);

    const { prompt } = await generatePrompt(token, { ...body, persona });
    console.log('prompt: ', prompt);

    const { image } = await generateImage(token, {
      prompt: `Generate a calm and neutral upper body photo style based on the description: ${prompt}`,
    });
    console.log('image: ', image);

    currentPersona.value.image = image;
  }

  async function submit(token: string, issueId: string): Promise<Persona> {
    const p = NewPersonaSchema.parse(currentPersona.value);

    // upload image
    if (p.image) {
      const { data, error } = (await useFetch('/api/s3/images', {
        method: 'post',
        headers: { Authorization: `Bearer ${token}` },
        body: { url: p.image },
      })) as AsyncData<ResourceObject<string> | null, Error>;

      if (error.value) {
        throw error.value;
      }

      if (!data.value) {
        throw new Error('data are null');
      }

      const { data: url, message } = data.value;

      console.log(data.value.data);
    }

    console.log('Creating: ', p);
    const { data } = await fetchResource<Persona>(
      token,
      `/api/issues/${issueId}/personas`,
      {
        method: 'post',
        body: p,
      }
    );
    console.log('Created:', data);

    return data;
  }

  async function edit(token: string, id: string): Promise<Persona> {
    loading.value = true;
    const i = NewPersonaSchema.parse(currentPersona.value);

    console.log('Patch: ', i);
    const { data } = await fetchResource<Persona>(
      token,
      `/api/personas/${id}`,
      {
        method: 'put',
        body: i,
      }
    );

    console.log('Edited: ', data);
    loading.value = false;
    return data;
  }

  async function remove(token: string, id: string) {
    loading.value = true;

    const { message } = await fetchResource<Persona>(
      token,
      `/api/personas/${id}`,
      {
        method: 'delete',
      }
    );

    console.log(message);
    loading.value = false;
  }

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveId();
      clearCurrentPersona();
    }
  });

  return {
    currentPersona,
    imageBuffer,
    activeId,
    state,
    loading,

    clearActiveId,
    clearCurrentPersona,
    setActiveId,
    setCurrentPersona,
    randomizeCurrentPersona,

    generatePortrait,
    submit,
    edit,
    remove,
  };
});
