export const useTabStore = definePiniaStore('tab', () => {
  const tab = ref<string | null>(null);

  function setTab(currentTab: string) {
    tab.value = currentTab;
  }

  return { tab, setTab };
});
