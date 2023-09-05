import { issueTabs } from '@/utils/issueTabs';

const tabPattern = `(${issueTabs.map((t) => t.name).join('|')})`;
const regex = new RegExp(
  `^/workshop/[0-9a-fA-F]{24}/issue/[0-9a-fA-F]{24}/${tabPattern}(\/.*)?$`
);

export const useTabStore = definePiniaStore('tab', () => {
  const tab = ref<string | null>(null);

  function setTab(newTab: string | null) {
    tab.value = newTab;
  }

  function setTabByPath(path: string) {
    const match = path.match(regex);
    setTab(match && (match[1] || null));
  }

  function clearTab() {
    tab.value = null;
  }

  return { tab, setTab, setTabByPath, clearTab };
});
