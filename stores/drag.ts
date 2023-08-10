import { Keyword } from '@/types/keyword';

export const useDragStore = definePiniaStore('drag', () => {
  const dragged = ref<Keyword | null>(null);

  return { dragged };
});
