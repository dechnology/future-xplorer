import { Keyword, User } from '@/types';

export const useKeywordStore = definePiniaStore('keywords', () => {
  const issueStore = useIssueStore();

  const keywords = ref<Keyword[]>([]);
  const loading = ref(false);

  // users can maybe be fetched from the database instead of computed out of keywords
  const keywordUsers = computed(() => {
    const users: User[] = [];
    const userIds: Set<string> = new Set();

    for (const kw of keywords.value) {
      if (!userIds.has(kw.creator._id)) {
        users.push({ ...kw.creator });
        userIds.add(kw.creator._id);
      }
    }
    return users;
  });

  async function update(token: string) {
    if (!issueStore.issueId) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResources<Keyword>(token, '/api/keywords', {
      query: {
        issueId: issueStore.issueId,
      },
    });

    keywords.value = data;
  }

  async function init(token: string) {
    await update(token);
  }

  return {
    keywords,
    loading,
    keywordUsers,

    update,
    init,
  };
});
