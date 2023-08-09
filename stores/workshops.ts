import { BaseWorkshop } from '@/types/workshop';

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<BaseWorkshop[] | null>(null);

  async function init() {
    workshops.value = await fetchAllWorkshops();
  }

  return { workshops, init };
});
