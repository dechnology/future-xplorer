import { fakerZH_TW } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { CardStates, NewPersonaSchema, personaPresets } from '@/types';
import type {
  Persona,
  NewPersona,
  CardState,
  PortraitRequestBody,
  ResourceObject,
} from '@/types';
import { AsyncData } from 'nuxt/app';

const baseFilepath = 'tdri/imgs/personas/originals';

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
  const imageUrlBuffer = ref<string | null>(null);
  const imageFileBuffer = ref<File | null>(null);
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);
  const loading = ref(false);

  function clearCurrentPersona() {
    imageUrlBuffer.value = null;
    imageFileBuffer.value = null;
    currentPersona.value = getNewPersona();
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function clearImageUrl() {
    imageUrlBuffer.value = null;
  }

  function setCurrentPersona(p: Persona) {
    currentPersona.value = { ...p };
  }

  function setActiveId(id: string) {
    activeId.value = id;
  }

  function setImageUrl(url: string) {
    imageUrlBuffer.value = url;
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

    imageFileBuffer.value = null;
    imageUrlBuffer.value = image;
  }

  async function submit(token: string, issueId: string): Promise<Persona> {
    const config = useRuntimeConfig();
    const p = NewPersonaSchema.parse(currentPersona.value);

    let filepath: string | null = null;

    if (imageFileBuffer.value) {
      filepath = `${baseFilepath}/${uuidv4()}.${imageFileBuffer.value.type}`;

      const { message } = await uploadImageFile(
        token,
        imageFileBuffer.value,
        filepath
      );

      console.log(message);
    } else if (imageUrlBuffer.value) {
      const ext = imageUrlBuffer.value.split('?')[0].split('.').pop();
      filepath = `${baseFilepath}/${uuidv4()}.${ext}`;

      const { message } = await uploadImageUrl(
        token,
        imageUrlBuffer.value,
        filepath
      );

      console.log(message);
    }

    imageUrlBuffer.value = null;

    if (filepath) {
      p.image = `https://${config.public.s3Domain}/${filepath}`;
      console.log(`image url: ${p.image}`);
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
    console.log('Created: ', data);

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
    imageUrlBuffer,
    imageFileBuffer,
    activeId,
    state,
    loading,

    clearActiveId,
    clearCurrentPersona,
    clearImageUrl,
    setActiveId,
    setCurrentPersona,
    setImageUrl,
    randomizeCurrentPersona,

    generatePortrait,
    submit,
    edit,
    remove,
  };
});
