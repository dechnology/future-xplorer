import { Workshop } from '@/types/workshop';

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[]>([]);

  async function init(token: string) {
    workshops.value = await fetchWorkshops(token);
    console.log(workshops.value);
  }

  function push(w: Workshop) {
    workshops.value.push(w);
  }

  return { workshops, init, push };
});
