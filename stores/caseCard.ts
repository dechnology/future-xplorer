import { v4 as uuidv4 } from 'uuid';
import { CardStates, NewCaseSchema } from '@/types';
import type { Case, NewCase, CardState } from '@/types';

const baseFilepath = 'tdri/imgs/cases/originals';

const getNewCase = (): NewCase => ({
  title: 'testing title',
  background: 'some bg...',
  method: 'some methods',
  goal: 'goals and stuffs',
  challenge: 'some challenges',
  result: 'some results',
  reference: 'https://www.google.com',
  other: '',
  // title: '',
  // background: '',
  // method: '',
  // goal: '',
  // challenge: '',
  // result: '',
  // reference: '',
  // other: '',
  image: null,
});

export const useCaseCardStore = definePiniaStore('case card', () => {
  const currentCase = ref<Case | NewCase>(getNewCase());
  const activeCase = ref<Case | null>(null);
  const imageFileBuffer = ref<File | null>(null);
  const imageUrlBuffer = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);
  const loading = ref(false);

  const activeId = computed(
    (): string | null => activeCase.value && activeCase.value._id
  );

  function clearCurrentCase() {
    currentCase.value = getNewCase();
  }

  function clearActiveCase() {
    activeCase.value = null;
  }

  function clearImage() {
    imageUrlBuffer.value = null;
    imageFileBuffer.value = null;
  }

  function setCurrentCase(c: Case) {
    currentCase.value = { ...c };
  }

  function setActiveCase(c: Case) {
    activeCase.value = c;
  }

  function setImageUrl(url: string) {
    imageUrlBuffer.value = url;
  }

  async function submit(token: string, issueId: string): Promise<Case> {
    const c = NewCaseSchema.parse(currentCase.value);

    if (imageUrlBuffer.value) {
      let s3Url: string;

      if (imageFileBuffer.value) {
        s3Url = (await uploadImageFile(token, imageFileBuffer.value)).data;
      } else {
        s3Url = (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      }
      clearImage();

      console.log(`image url: ${s3Url}`);
      c.image = s3Url;
    }

    imageUrlBuffer.value = null;

    console.log('Creating: ', c);
    const { data } = await fetchResource<Case>(
      token,
      `/api/issues/${issueId}/cases`,
      {
        method: 'post',
        body: c,
      }
    );
    console.log('Created: ', data);

    return data;
  }

  async function edit(token: string, id: string): Promise<Case> {
    loading.value = true;
    const c = NewCaseSchema.parse(currentCase.value);

    if (imageUrlBuffer.value) {
      let s3Url: string;

      if (imageFileBuffer.value) {
        s3Url = (await uploadImageFile(token, imageFileBuffer.value)).data;
      } else {
        s3Url = (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      }
      clearImage();

      console.log(`image url: ${s3Url}`);
      c.image = s3Url;
    }

    console.log('Patch: ', c);
    const { data } = await fetchResource<Case>(token, `/api/cases/${id}`, {
      method: 'put',
      body: c,
    });

    console.log('Edited: ', data);
    loading.value = false;
    return data;
  }

  async function remove(token: string, id: string) {
    loading.value = true;

    const { message } = await fetchResource<Case>(token, `/api/cases/${id}`, {
      method: 'delete',
    });

    console.log(message);
    loading.value = false;
  }

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveCase();
      clearCurrentCase();
    }
  });

  return {
    currentCase,
    activeCase,
    imageFileBuffer,
    imageUrlBuffer,
    activeId,
    state,

    clearCurrentCase,
    clearActiveCase,
    clearImage,
    setCurrentCase,
    setActiveCase,
    setImageUrl,

    submit,
    edit,
    remove,
  };
});
