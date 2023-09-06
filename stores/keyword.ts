import { User } from '@/types';

export const useKeywordStore = definePiniaStore('keywords', () => {
  const { user } = useAuth();
  const caseStore = useCaseStore();

  const loading = ref(false);

  const keywords = computed(() =>
    caseStore.cases.flatMap((c) => [...c.keywords])
  );

  const keywordUsers = computed(() => {
    const users: User[] = [];
    const userIds: Set<string> = new Set(); // Assuming the ID is a string

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
    keywords,
    loading,
    selfKeywords,
    selfVotes,
    selfVotedIds,
    favoriteKeywords,
    nonFavoriteKeywords,
    nonFavoriteSelfKeywords,
    keywordUsers,
  };
});
