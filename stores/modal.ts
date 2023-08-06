import { ModalConent } from '@/types/modal';

export const useModalStore = definePiniaStore('modal', () => {
  const shown = ref(false);

  const content = ref<ModalConent>({});

  function show() {
    // this line forces a reopen since the open is triggered by a state change
    if (!shown.value) shown.value = false;
    shown.value = true;
  }

  function close() {
    shown.value = false;
  }

  function toggle() {
    shown.value = !shown.value;
  }

  function setContent(newContent: ModalConent) {
    content.value = newContent;
  }

  return {
    shown,
    content,
    show,
    close,
    toggle,
    setContent,
  };
});
