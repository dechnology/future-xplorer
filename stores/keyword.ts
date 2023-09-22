import { User } from '@/types';

export const useKeywordStore = definePiniaStore('keywords', () => {
  const { user } = useAuth();
  const caseStore = useCaseStore();

  const loading = ref(false);

  const keywords = computed(() =>
    caseStore.cases
      .flatMap((c) => [...c.keywords])
      .sort((a, b) => {
        if (!a.category) return -1;
        if (!b.category) return 1;
        return 0;
      })
  );

  const votedKeywords = computed(() =>
    keywords.value.filter((kw) => kw.votes.length > 0)
  );

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

  const selfKeywords = computed(() =>
    keywords.value.filter((kw) => kw.creator._id === user.value?._id)
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

  const selfVotedIds = computed(() =>
    selfVotes.value.map((vote) => vote.keyword._id)
  );

  const favoriteKeywords = computed(() =>
    keywords.value.filter((kw) => selfVotedIds.value.includes(kw._id))
  );

  const nonFavoriteKeywords = computed(() =>
    keywords.value.filter((kw) => !selfVotedIds.value.includes(kw._id))
  );

  const nonFavoriteSelfKeywords = computed(() =>
    nonFavoriteKeywords.value.filter((kw) => kw.creator._id === user.value?._id)
  );

  return {
    loading,
    keywords,
    votedKeywords,
    selfKeywords,
    selfVotes,
    selfVotedIds,
    favoriteKeywords,
    nonFavoriteKeywords,
    nonFavoriteSelfKeywords,
    keywordUsers,
  };
});
