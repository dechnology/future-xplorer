import { Keyword } from '@/types';

export const useKeywordStore = definePiniaStore('keywords', () => {
  const keywords = ref<Keyword[]>([]);

  function setKeywords(new_keywords: Keyword[]) {
    keywords.value = new_keywords;
  }

  function upsert(k: Keyword) {
    const index = keywords.value.findIndex((persona) => persona._id === k._id);

    if (index === -1) {
      keywords.value.push(k);
    } else {
      keywords.value[index] = k;
    }
  }

  return {
    keywords,
    setKeywords,
    upsert,
  };
});
