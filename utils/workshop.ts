import { Workshop } from '@/types/workshop';

export const fetchAllWorkshops = async (token: string): Promise<Workshop[]> => {
  const { data, error } = await useFetch('/api/workshops', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('workshops are null');
  }

  const { workshops: serializedWorkshops } = data.value;

  return serializedWorkshops.map((w) => deserializeWorkshop(w));
};
