import { Keyword, NewKeyword, NewKeywordSchema } from '@/types';
import { z } from 'zod';

export const useKeywordStore = definePiniaStore('keywords', () => {
  const keywords = ref<Keyword[]>([]);
  const newKeywords = ref<NewKeyword[]>([]);

  const allKeywords = computed((): (Keyword | NewKeyword)[] => [
    ...newKeywords.value,
    ...keywords.value,
  ]);

  function setKeywords(new_keywords: Keyword[]) {
    keywords.value = new_keywords;
  }

  function append(k: Keyword | NewKeyword) {
    if ('_id' in k) {
      keywords.value.push(k);
    } else {
      newKeywords.value.push(k);
    }
  }

  function upsert(k: Keyword) {
    const index = keywords.value.findIndex((keyword) =>
      '_id' in keyword ? keyword._id === k._id : -1
    );

    if (index === -1) {
      keywords.value.push(k);
    } else {
      keywords.value[index] = k;
    }
    return;
  }

  async function save(token: string, caseId: string) {
    const result = z.array(NewKeywordSchema).parse(newKeywords.value);

    console.log('Creating: ', result);
    const { data } = await fetchResource<Keyword>(
      token,
      `/api/cases/${caseId}/keywords`,
      {
        method: 'post',
        body: { keywords: result },
      }
    );
    console.log('Created: ', data);

    return data;
  }

  return {
    keywords,
    newKeywords,
    allKeywords,
    setKeywords,
    append,
    upsert,
    save,
  };
});
