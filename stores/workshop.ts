import {
  WorkshopElementItem,
  WorkshopElement,
  Workshop,
  WorkshopState,
  WorkshopStates,
} from '@/types/workshop';

const EmptyWorkshop = {
  name: '',
  description: '',
  creator: '',

  elements: [
    {
      name: 'objects',
      description: '物件 or 技術',
      items: [{ name: '技術', color: '#000' }] as WorkshopElementItem[],
    },
    {
      name: 'environments',
      description: '環境 or 場景',
      items: [{ name: '場景體驗', color: '#000' }] as WorkshopElementItem[],
    },
    {
      name: 'messages',
      description: '訊息 or 目標',
      items: [{ name: '洞見與價值', color: '#000' }] as WorkshopElementItem[],
    },
    {
      name: 'services',
      description: '服務、行動 or 經驗',
      items: [{ name: '使用者體驗', color: '#000' }] as WorkshopElementItem[],
    },
  ] as WorkshopElement[],
} as Workshop;

export const useWorkshopStore = definePiniaStore('workshop', () => {
  // fetched
  const workshops = ref<Workshop[] | null>(null);
  const cachedWorkshop = ref<Workshop | null>(null);

  // current session usage
  const activeWorkshop = ref<Workshop | null>(null);
  const currentWorkshop = ref<Workshop>(EmptyWorkshop);

  const loading = ref(true);
  const state = ref<WorkshopState>(WorkshopStates.New);
  const modalShown = ref(false);

  async function initStore() {
    const { data } = await useFetch('/api/workshops');

    // Fetching error
    if (data.value === null) {
      return;
    }

    workshops.value = data.value.map((rawWorkshop) => ({
      ...rawWorkshop,
      createdAt: convertDateStr(rawWorkshop.createdAt),
      updatedAt: convertDateStr(rawWorkshop.updatedAt),
      startAt: convertDateStr(rawWorkshop.startAt),
      endAt: convertDateStr(rawWorkshop.endAt),
    }));

    resetCurrentWorkshop();

    // console.log(workshops.value);

    // TODO: retrieve cached issue from session/local storage
  }

  function resetCurrentWorkshop() {
    currentWorkshop.value = { ...EmptyWorkshop, creator: 'HEHE4' };
  }

  function setCurrentWorkshop(cached: boolean = true) {
    if (cached) {
      if (cachedWorkshop.value === null) {
        resetCurrentWorkshop();
      } else {
        currentWorkshop.value = { ...cachedWorkshop.value };
      }
      return;
    }

    if (!activeWorkshop.value) {
      throw Error('no issue seleted');
    }
    currentWorkshop.value = { ...activeWorkshop.value };
  }

  function cacheWorkshop() {}

  watch(state, (newState, oldState) => {
    // We will use cached form inputs if possible when in New state
    setCurrentWorkshop(newState.name === WorkshopStates.New.name);
    if (oldState.name === WorkshopStates.New.name) {
      cacheWorkshop();
    }
  });

  return {
    workshops,
    cachedWorkshop,

    activeWorkshop,
    currentWorkshop,

    loading,
    state,
    modalShown,

    initStore,
    resetCurrentWorkshop,
    setCurrentWorkshop,
    cacheWorkshop,
  };
});
