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

export const updatePersona = async (
  token: string,
  personaId: string,
  p: NewPersona
): Promise<Persona> => {
  const { data, error } = await useFetch(`/api/personas/${personaId}`, {
    method: 'put',
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

export const deletePersona = async (
  token: string,
  personaId: string
): Promise<{ message: string; persona: Persona | null }> => {
  const { data, error } = await useFetch(`/api/personas/${personaId}`, {
    method: 'delete',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { message, persona: serializedPersona } = data.value;

  return {
    message,
    persona: serializedPersona && deserializePersona(serializedPersona),
  };
};
