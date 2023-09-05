import { uploadImageFile } from './../utils/db';
import { fakerZH_TW } from '@faker-js/faker';
import { CardStates, NewPersonaSchema, personaPresets } from '@/types';
import type {
  Persona,
  NewPersona,
  CardState,
  PortraitRequestBody,
} from '@/types';

const getNewPersona = (): NewPersona => ({
  role: '',
  name: '',
  age: '',
  trait: '',
  gender: 'male',
  other: '',
  image: null,
});

const getRandomNewPersona = (): NewPersona => ({
  role: fakerZH_TW.helpers.arrayElement(personaPresets.role),
  name: fakerZH_TW.person.fullName(),
  age: fakerZH_TW.helpers.arrayElement(personaPresets.age),
  trait: fakerZH_TW.helpers.arrayElement(personaPresets.trait),
  gender: fakerZH_TW.helpers.arrayElement(personaPresets.gender),
  other: '',
  image: null,
});

export const usePersonaCardStore = definePiniaStore('persona card', () => {
  const currentPersona = ref<Persona | NewPersona>(getNewPersona());
  const activePersona = ref<Persona | null>(null);
  const imageUrlBuffer = ref<string | null>(null);
  const imageFileBuffer = ref<File | null>(null);
  const state = ref<CardState>(CardStates.New);
  const loading = ref(false);

  const activeId = computed(
    (): string | null => activePersona.value && activePersona.value._id
  );

  function clearCurrentPersona() {
    clearImage();
    imageFileBuffer.value = null;
    currentPersona.value = getNewPersona();
  }

  function clearActivePersona() {
    activePersona.value = null;
  }

  function clearImage() {
    imageUrlBuffer.value = null;
    imageFileBuffer.value = null;
  }

  function setCurrentPersona(p: Persona) {
    currentPersona.value = { ...p };
    if (p.image) {
      setImageUrl(p.image);
    } else {
      clearImage();
    }
  }

  function setActivePersona(p: Persona) {
    activePersona.value = p;
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

    const { image } = await generateImage(token, { prompt });
    console.log('image: ', image);

    imageFileBuffer.value = null;
    imageUrlBuffer.value = image;
  }

  async function submit(token: string, issueId: string): Promise<Persona> {
    const p = NewPersonaSchema.parse(currentPersona.value);

    if (imageUrlBuffer.value) {
      let s3Url: string;

      if (imageFileBuffer.value) {
        s3Url = (await uploadImageFile(token, imageFileBuffer.value)).data;
      } else {
        s3Url = (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      }
      clearImage();

      console.log(`image url: ${s3Url}`);
      p.image = s3Url;
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
    const p = NewPersonaSchema.parse(currentPersona.value);

    if (imageUrlBuffer.value) {
      let s3Url: string;

      if (imageFileBuffer.value) {
        s3Url = (await uploadImageFile(token, imageFileBuffer.value)).data;
      } else {
        s3Url = (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      }
      clearImage();

      console.log(`image url: ${s3Url}`);
      p.image = s3Url;
    }

    console.log('Patch: ', p);
    const { data } = await fetchResource<Persona>(
      token,
      `/api/personas/${id}`,
      {
        method: 'put',
        body: p,
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
      clearActivePersona();
      clearCurrentPersona();
    }
  });

  return {
    currentPersona,
    activePersona,
    imageUrlBuffer,
    imageFileBuffer,
    activeId,
    state,
    loading,

    clearActivePersona,
    clearCurrentPersona,
    clearImage,
    setActivePersona,
    setCurrentPersona,
    setImageUrl,
    randomizeCurrentPersona,

    generatePortrait,
    submit,
    edit,
    remove,
  };
});
