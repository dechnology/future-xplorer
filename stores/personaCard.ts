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
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentPersona() {
    currentPersona.value = getNewPersona();
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function setCurrentPersona(w: Persona) {
    currentPersona.value = { ...w };
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

  async function submit(token: string, issueId: string) {
    const persona = NewPersonaSchema.parse(currentPersona.value);

    console.log('Creating: ', persona);
    const createdPersona = await createPersona(token, issueId, persona);

    return createdPersona;
  }

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveId();
      clearCurrentPersona();
    }
  });

  return {
    activeId,
    currentPersona,
    state,

    clearActiveId,
    clearCurrentPersona,
    setActiveId,
    setCurrentPersona,
    randomizeCurrentPersona,

    generatePortrait,
    submit,
  };
});
