import { Case, Keyword, User } from '@/types';

interface KeywordUpdateOptions {
  self?: boolean;
}

export const useKeywordStore = definePiniaStore('keywords', () => {
  const { user, userId } = useAuth();
  const issueStore = useIssueStore();

  const loading = ref(false);

  const searchQuery = ref<string>();
  const keywords = ref<Keyword[]>([]);

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

  const votedKeywords = computed(() =>
    keywords.value.filter((kw) => kw.votes.length > 0)
  );

  const selfVotes = computed(() =>
    user.value
      ? keywords.value.flatMap((kw) =>
          kw.votes.filter(
            (vote) => vote.creator._id === (user.value as User)._id
          )
        )
      : []
  );

  const favoriteKeywords = computed(() =>
    keywords.value.filter((kw) =>
      selfVotes.value.map((vote) => vote.keyword._id).includes(kw._id)
    )
  );

  const nonFavoriteKeywords = computed(() =>
    keywords.value.filter(
      (kw) => !selfVotes.value.map((vote) => vote.keyword._id).includes(kw._id)
    )
  );

  const nonFavoriteSelfKeywords = computed(() =>
    nonFavoriteKeywords.value.filter((kw) => kw.creator._id === user.value?._id)
  );

  async function update(
    token: string,
    opt: KeywordUpdateOptions = { self: false }
  ) {
    if (!issueStore.issueId) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResources<Keyword>(token, '/api/keywords', {
      query: {
        issueId: issueStore.issueId,
        userIds: opt.self && user.value ? [userId.value] : undefined,
        searchQuery: searchQuery.value,
      },
    });

    keywords.value = data;
  }

  async function init(token: string, opt?: KeywordUpdateOptions) {
    await update(token, opt);
  }

  return {
    loading,
    keywords,
    votedKeywords,
    selfVotes,
    favoriteKeywords,
    nonFavoriteKeywords,
    nonFavoriteSelfKeywords,
    keywordUsers,

    update,
    init,
  };
});
