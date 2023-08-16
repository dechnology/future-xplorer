import type { PortraitRequestBody } from '@/types';

export const generatePrompt = async (
  token: string,
  body: PortraitRequestBody
): Promise<{ prompt: string }> => {
  const { data, error } = await useFetch(`/api/openai/portrait_prompt`, {
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

  return {
    prompt,
  };
};

export const generateImage = async (
  token: string,
  body: { prompt: string }
): Promise<{ image: string }> => {
  const { data, error } = await useFetch(`/api/openai/image`, {
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

  const { image } = data.value;

  return { image };
};
