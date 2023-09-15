import { IssueTab, IssueTabKeys, IssueTabs } from '~/types';

export const tabStorgeKey = 'tab';

export const sortStorageKey = 'sort element';

export const voteStorageKey = 'vote category';

export const readLocalStorage = (key: string) => {
  if (!process.client) {
    return;
  }

  return localStorage.getItem(key);
};

export const readCurrentTab = (defaultTab: IssueTab = IssueTabs.persona) => {
  try {
    const tabData = readLocalStorage(tabStorgeKey);

    if (!tabData) {
      throw new Error('no cache');
    }

    const currentTab = IssueTabs[tabData as IssueTabKeys];

    if (!currentTab) {
      throw new Error(`${tabData} tab does not exist`);
    }

    console.log(currentTab);

    return currentTab;
  } catch (e) {
    console.error(e);
    return defaultTab;
  }
};
