import { NewWorkshop, Workshop } from '@/types/workshop';

export const fetchWorkshops = async (token: string): Promise<Workshop[]> => {
  const { data, error } = await useFetch('/api/workshops', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { workshops: serializedWorkshops } = data.value;

  return serializedWorkshops.map((w) => deserializeWorkshop(w));
};

export const fetchWorkshop = async (
  token: string,
  workshopId: string
): Promise<{ workshop: Workshop }> => {
  const { data, error } = await useFetch(`/api/workshops/${workshopId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { workshop: serializedWorkshop } = data.value;

  return {
    workshop: deserializeWorkshop(serializedWorkshop),
  };
};

export const createWorkshop = async (
  token: string,
  w: NewWorkshop
): Promise<Workshop> => {
  const { data, error } = await useFetch('/api/workshops', {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body: w,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { workshop: serializedWorkshop } = data.value;

  return deserializeWorkshop(serializedWorkshop);
};

export const updateWorkshop = async (
  token: string,
  workshopId: string,
  w: NewWorkshop
): Promise<Workshop> => {
  const { data, error } = await useFetch(`/api/workshops/${workshopId}`, {
    method: 'put',
    headers: { Authorization: `Bearer ${token}` },
    body: w,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { workshop: serializedWorkshop } = data.value;

  return deserializeWorkshop(serializedWorkshop);
};

export const deleteWorkshop = async (
  token: string,
  workshopId: string
): Promise<{ message: string; workshop: Workshop | null }> => {
  const { data, error } = await useFetch(`/api/workshops/${workshopId}`, {
    method: 'delete',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { message, workshop: serializedWorkshop } = data.value;

  return {
    message,
    workshop: serializedWorkshop && deserializeWorkshop(serializedWorkshop),
  };
};
