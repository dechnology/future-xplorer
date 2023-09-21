import type {
  IllustrationPromptRequestBody,
  IllustrationPromptResponseBody,
  KeywordsRequestBody,
  KeywordsResponseBody,
  PortraitRequestBody,
  StoryRemakeRequestBody,
  StoryRequestBody,
  StoryResponseBody,
} from '@/types';

export const generatePortraitPrompt = async (
  token: string,
  body: PortraitRequestBody
): Promise<{ err: any; prompt: string }> => {
  try {
    const { data, error } = await useFetch(`/api/openai/prompt/portrait`, {
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    if (error.value) {
      console.log('error.value =>', error.value);
      return { err: error.value, prompt: '' };
    }

    if (!data.value) {
      return { err: new Error('data are null'), prompt: '' };
    }

    const { prompt } = data.value;

    return {
      err: null,
      prompt,
    };
  } catch (e) {
    return { err: e, prompt: '' };
  }
};

export const generateImage = async (
  token: string,
  body: { prompt: string }
): Promise<{ err: any; image: string }> => {
  try {
    const { data, error } = await useFetch(`/api/openai/image`, {
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    if (error.value) {
      return { err: error.value, image: '' };
    }

    if (!data.value) {
      return { err: new Error('data are null'), image: '' };
    }

    const { image } = data.value;

    return {
      err: null,
      image,
    };
  } catch (e) {
    return { err: e, image: '' };
  }
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

export const generateIllustrationPrompt = async (
  token: string,
  body: IllustrationPromptRequestBody
): Promise<IllustrationPromptResponseBody> => {
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
