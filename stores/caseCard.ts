import type { Case, NewCase, CardState } from '@/types';
import { CardStates, NewCaseSchema } from '@/types';

const getNewCase = (): NewCase => ({
  title: '',
  background: '',
  method: '',
  goal: '',
  challenge: '',
  result: '',
  reference: '',
  other: '',
});

export const useCaseCardStore = definePiniaStore('case card', () => {
  const currentCase = ref<Case | NewCase>(getNewCase());
  const imageBuffer = ref<string | null>(null);
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);
  const loading = ref(false);

  function clearCurrentCase() {
    currentCase.value = getNewCase();
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function setCurrentCase(c: Case) {
    currentCase.value = { ...c };
  }

  function setActiveId(id: string) {
    activeId.value = id;
  }

  async function submit(token: string, issueId: string): Promise<Case> {
    const c = NewCaseSchema.parse(currentCase.value);

    // upload image
    if (imageBuffer.value) {
      const config = useRuntimeConfig();
      const ext = imageBuffer.value.split('?')[0].split('.').pop();
      const fileName = `${p.name}_${p.gender}_${p.age}.${ext}`;
      const filePath = `tdri/imgs/personas/originals/${fileName}`;

      p.image = `https://${config.public.s3Domain}/${filePath}`;
      console.log(`image url: ${p.image}`);

      const { data, error } = (await useFetch('/api/s3/images', {
        method: 'post',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          url: imageBuffer.value,
          key: filePath,
        },
      })) as AsyncData<ResourceObject<string> | null, Error>;

      if (error.value) {
        throw error.value;
      }

      if (!data.value) {
        throw new Error('data are null');
      }

      const { message } = data.value;

      console.log(message);
      imageBuffer.value = null;
    }

    console.log('Creating: ', p);
    const { data } = await fetchResource<Case>(
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

  async function edit(token: string, id: string): Promise<Case> {
    loading.value = true;
    const i = NewCaseSchema.parse(currentCase.value);

    console.log('Patch: ', i);
    const { data } = await fetchResource<Case>(token, `/api/personas/${id}`, {
      method: 'put',
      body: i,
    });

    console.log('Edited: ', data);
    loading.value = false;
    return data;
  }

  async function remove(token: string, id: string) {
    loading.value = true;

    const { message } = await fetchResource<Case>(
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
      clearCurrentCase();
    }
  });

  return {
    currentCase,
    activeId,
    state,

    clearCurrentCase,
    clearActiveId,
    setCurrentCase,
    setActiveId,
  };
});
