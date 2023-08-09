import { Workshop } from '@/types/workshop';

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[] | null>(null);

  async function init() {
    workshops.value = await fetchAllWorkshops();
  }

  return { workshops, init };
});
