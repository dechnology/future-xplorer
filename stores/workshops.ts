import { Workshop } from '@/types/workshop';

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[]>([]);

  async function init(token: string) {
    const { data } = await fetchResources<Workshop>(token, '/api/workshops');
    workshops.value = data;
  }

  function findById(id: string): Workshop | null {
    const index = workshops.value.findIndex((workshop) => workshop._id === id);

    return index === -1 ? null : workshops.value[index];
  }

  function upsert(w: Workshop) {
    const index = workshops.value.findIndex(
      (workshop) => workshop._id === w._id
    );
    if (index === -1) {
      workshops.value.push(w);
    } else {
      workshops.value[index] = w;
    }
  }

  function remove(id: string) {
    const index = workshops.value.findIndex((workshop) => workshop._id === id);

    if (index === -1) {
      throw new Error('no workshop match given id');
    } else {
      workshops.value.splice(index, 1);
    }
  }

  return { workshops, init, findById, upsert, remove };
});
