import { NewPersona, Persona } from '@/types';

export const createPersona = async (
  token: string,
  issueId: string,
  p: NewPersona
): Promise<Persona> => {
  const { data, error } = await useFetch(`/api/issues/${issueId}/personas`, {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body: p,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { persona: serializedPersona } = data.value;

  return deserializePersona(serializedPersona);
};
