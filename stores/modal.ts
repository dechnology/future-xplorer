export const useModalStore = definePiniaStore('modal', () => {
  const shown = ref(false);
  const ignoreNextClose = ref(false);

  function show() {
    // this line forces a reopen since the open is triggered by a state change
    if (shown.value) shown.value = false;
    shown.value = true;
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
