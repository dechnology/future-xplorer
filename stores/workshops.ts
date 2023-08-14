import { Workshop } from '@/types/workshop';

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[] | null>(null);

  async function init(token: string) {
    workshops.value = await fetchAllWorkshops(token);
    console.log(workshops.value);
  }

  return { workshops, init };
});
