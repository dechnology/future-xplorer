import {
  CardWorkshop,
  Workshop,
  ElementGroup,
  BaseCardWorkshop,
} from '@/types/workshop';
import { CardState, CardStates } from '@/types/cardState';
import { format } from 'date-fns';

const getNewWorkshop = (): BaseCardWorkshop => {
  const now = format(new Date(), 'yyyy/MM/dd');

  return {
    name: '',
    description: '',

    dateValue: {
      start: now,
      end: now,
    },

    object: ['技術'],
    environment: ['場景體驗'],
    message: ['洞見與價值'],
    service: ['使用者體驗'],
  };
};

export const toCardWorkshop = (w: Workshop): CardWorkshop => {
  const { startAt, endAt, elements, ...cardWorkshop } = w;

  const elementGroup: ElementGroup = {
    object: [],
    environment: [],
    message: [],
    service: [],
  };

  for (const el of elements) {
    switch (el.category) {
      case 'object':
        elementGroup.object.push(el.name);
        break;
      case 'environment':
        elementGroup.environment.push(el.name);
        break;
      case 'message':
        elementGroup.message.push(el.name);
        break;
      case 'service':
        elementGroup.service.push(el.name);
        break;
    }
  }

  const dateValue = {
    start: format(startAt, 'yyyy/MM/dd'),
    end: format(endAt, 'yyyy/MM/dd'),
  };

  return { dateValue, ...cardWorkshop, ...elementGroup };
};

export const useWorkshopCardStore = definePiniaStore('workshop card', () => {
  const activeWorkshop = ref<Workshop | null>(null);
  const currentWorkshop = ref<BaseCardWorkshop | CardWorkshop>(
    getNewWorkshop()
  );
  const state = ref<CardState>(CardStates.New);

  function clearCurrentWorkshop() {
    currentWorkshop.value = getNewWorkshop();
  }

  function setCurrentWorkshop(w: Workshop) {
    currentWorkshop.value = toCardWorkshop(w);
  }

  function clearActiveWorkshop() {
    activeWorkshop.value = null;
  }

  function setActiveWorkshop(w: Workshop) {
    activeWorkshop.value = { ...w };
  }

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveWorkshop();
      clearCurrentWorkshop();
    }
  });

  return {
    activeWorkshop,
    currentWorkshop,
    state,

    clearCurrentWorkshop,
    setCurrentWorkshop,
    clearActiveWorkshop,
    setActiveWorkshop,
  };
});
