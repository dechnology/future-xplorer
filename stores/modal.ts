export const useModalStore = definePiniaStore('modal', () => {
  const shown = ref(false);

  function show() {
    // this line forces a reopen since the open is triggered by a state change
    if (shown.value) shown.value = false;
    shown.value = true;
  }

  function close() {
    shown.value = false;
  }

  function toggle() {
    shown.value = !shown.value;
  }

  return {
    shown,
    show,
    close,
    toggle,
  };
});
