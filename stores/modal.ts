export const useModalStore = definePiniaStore('modal', () => {
  const shown = ref(false);
  const ignoreNextClose = ref(false);

  function show() {
    if (shown.value) {
      // this forces a reopen since the open is triggered by a state change
      shown.value = false;
      nextTick().then(() => (shown.value = true));
    } else {
      shown.value = true;
    }
  }

  function close() {
    if (ignoreNextClose.value) {
      ignoreNextClose.value = false;
      return;
    }
    shown.value = false;
  }

  function toggle() {
    shown.value = !shown.value;
  }

  return {
    shown,
    ignoreNextClose,
    show,
    close,
    toggle,
  };
});
