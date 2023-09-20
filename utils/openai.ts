import type {
  KeywordsRequestBody,
  KeywordsResponseBody,
  PortraitRequestBody,
} from '@/types';

export const generatePrompt = async (
  token: string,
  body: PortraitRequestBody
): Promise<{ err: any; prompt: string }> => {
  try {
    const { data, error } = await useFetch(`/api/openai/portrait_prompt`, {
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
