import { format } from 'date-fns';
import type { NewWorkshop, User, Workshop } from '@/types';

const FormStates = {
  NEW: {
    formTitle: '新增工作坊',
  },
  DETAILS: {
    formTitle: '工作坊資訊',
  },
  EDITING: {
    formTitle: '工作坊編輯',
  },
} as const;

const getNewWorkshop = (): NewWorkshop => {
  const now = format(new Date(), 'yyyy/MM/dd');

  return {
    name: '',
    description: '',

    dateValue: {
      start: now,
      end: now,
    },

    objects: ['技術'],
    environments: ['場景體驗'],
    messages: ['洞見與價值'],
    services: ['使用者體驗'],
  };
};

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[]>([]);
  const currentWorkshop = ref<NewWorkshop | Workshop>(getNewWorkshop());

  const activeId = ref<string | null>(null);
  const activeWorkshop = useArrayFind(
    workshops,
    (w) => w._id === activeId.value
  );

  const state = ref<keyof typeof FormStates>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const currentFormCardProps = computed(() => {
    let creator: User | undefined;
    if ('creator' in currentWorkshop.value) {
      creator = currentWorkshop.value.creator;
    }

    let timestamps: { createdAt: Date; updatedAt: Date } | undefined;
    if (
      'createdAt' in currentWorkshop.value &&
      'updatedAt' in currentWorkshop.value
    ) {
      const { createdAt, updatedAt } = currentWorkshop.value;
      timestamps = { createdAt, updatedAt };
    }

    return {
      formTitle: FormStates[state.value].formTitle,
      creator,
      timestamps,
    };
  });

  async function init(token: string) {
    const { data } = await fetchResources<Workshop>(token, '/api/workshops');
    workshops.value = data;
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

  function clearCurrentWorkshop() {
    currentWorkshop.value = getNewWorkshop();
  }

  function changeActiveWorkshop(w?: Workshop) {
    if (w) {
      activeId.value = w._id;
      currentWorkshop.value = { ...w };
      state.value = 'DETAILS';
    } else {
      activeId.value = null;
      clearCurrentWorkshop();
      state.value = 'NEW';
    }
  }

  return {
    workshops,
    currentWorkshop,

    activeId,
    activeWorkshop,

    state,
    loading,
    formDisabled,
    currentFormCardProps,

    init,
    upsert,
    remove,

    clearCurrentWorkshop,
    changeActiveWorkshop,
  };
});
