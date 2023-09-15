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

    return IssueTabs[tabData as IssueTabKeys];
  } catch (e) {
    console.error(e);
    return defaultTab;
  }
};
