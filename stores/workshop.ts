import { Workshop, BaseIssue, NewIssue, User } from '@/types';

const FormStates = {
  NEW: {
    formTitle: '新增議題',
  },
  DETAILS: {
    formTitle: '議題資訊',
  },
  EDITING: {
    formTitle: '議題編輯',
  },
} as const;

const getNewIssue = (): NewIssue => ({
  title: '',
  description: '',
});

export const useWorkshopStore = definePiniaStore('workshop', () => {
  const workshop = ref<Workshop | null>(null);
  const workshopId = computed(() => workshop.value?._id);

  const issues = ref<BaseIssue[]>([]);
  const currentIssue = ref<NewIssue | BaseIssue>(getNewIssue());

  const activeId = ref<string | null>(null);
  const activeIssue = useArrayFind(issues, (i) => i._id === activeId.value);

  const state = ref<keyof typeof FormStates>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const currentFormCardProps = computed(() => {
    let creator: User | undefined;
    if ('creator' in currentIssue.value) {
      creator = currentIssue.value.creator;
    }

    let timestamps: { createdAt: Date; updatedAt: Date } | undefined;
    if (
      'createdAt' in currentIssue.value &&
      'updatedAt' in currentIssue.value
    ) {
      const { createdAt, updatedAt } = currentIssue.value;
      timestamps = { createdAt, updatedAt };
    }

    return {
      formTitle: FormStates[state.value].formTitle,
      creator,
      timestamps,
    };
  });

  async function init(token: string, workshopId: string) {
    const [workshopResponse, issuesResponse] = await Promise.all([
      fetchResource<Workshop>(token, `/api/workshops/${workshopId}`),
      fetchResources<BaseIssue>(token, `/api/workshops/${workshopId}/issues`),
    ]);

    workshop.value = workshopResponse.data;
    issues.value = issuesResponse.data;
  }

  function upsert(w: BaseIssue) {
    const index = issues.value.findIndex((issue) => issue._id === w._id);
    if (index === -1) {
      issues.value.push(w);
    } else {
      issues.value[index] = w;
    }
  }

  function remove(id: string) {
    const index = issues.value.findIndex((issue) => issue._id === id);

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issues.value.splice(index, 1);
    }
  }

  function clearCurrentIssue() {
    currentIssue.value = getNewIssue();
  }

  function changeActiveIssue(i?: BaseIssue) {
    if (i) {
      activeId.value = i._id;
      currentIssue.value = { ...i };
      state.value = 'DETAILS';
    } else {
      activeId.value = null;
      clearCurrentIssue();
      state.value = 'NEW';
    }
  }

  return {
    workshop,
    workshopId,
    issues,
    currentIssue,

    activeId,
    activeIssue,

    state,
    loading,
    formDisabled,
    currentFormCardProps,

    init,
    upsert,
    remove,

    clearCurrentIssue,
    changeActiveIssue,
  };
});
