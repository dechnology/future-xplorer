import type {
  PromptResponseBody,
  IllustrationPromptRequestBody,
  KeywordsRequestBody,
  KeywordsResponseBody,
  PortraitRequestBody,
  StoryCombineRequestBody,
  StoryRemakeRequestBody,
  StoryRequestBody,
  StoryResponseBody,
} from '@/types';

export const generatePortraitPrompt = async (
  token: string,
  body: PortraitRequestBody
): Promise<{ prompt: string }> => {
  const { data, error } = await useFetch(`/api/openai/prompt/portrait`, {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { prompt } = data.value;

  return { prompt };
};

export const generateImage = async (
  token: string,
  body: { prompt: string }
): Promise<{ image: string }> => {
  const { data, error } = await useFetch(
    `/api/openai/image?nocache=${Date.now()}`,
    {
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      body,
    }
  );

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  return data.value;
};

export const generateKeywords = async (
  token: string,
  body: KeywordsRequestBody
): Promise<KeywordsResponseBody> => {
  const { data, error } = await useFetch(`/api/openai/keywords`, {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  console.log('data.value', data.value);

  return data.value;
};

export const generateStory = async (
  token: string,
  body: StoryRequestBody
): Promise<StoryResponseBody> => {
  const { data, error } = await useFetch(`/api/openai/story/generation`, {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { story } = data.value;

  return { story };
};

export const generateStoryRemake = async (
  token: string,
  body: StoryRemakeRequestBody
): Promise<StoryResponseBody> => {
  const { data, error } = await useFetch(`/api/openai/story/remake`, {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { story } = data.value;

  return { story };
};

export const generateStoryCombine = async (
  token: string,
  body: StoryCombineRequestBody
): Promise<StoryResponseBody> => {
  const { data, error } = await useFetch(`/api/openai/story/combine`, {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { story } = data.value;

  return { story };
};

export const generateIllustrationPrompt = async (
  token: string,
  body: IllustrationPromptRequestBody
): Promise<PromptResponseBody> => {
  const { data, error } = await useFetch(`/api/openai/prompt/illustration`, {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { prompt } = data.value;

  return { prompt };
};
