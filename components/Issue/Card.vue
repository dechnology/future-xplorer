<template>
  <form
    @submit.prevent="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <CardHeader
      :title="`議題${state.formTitle}`"
      :creator="'creator' in currentIssue ? currentIssue.creator : undefined"
      :user="user"
    />
    <div class="flex flex-col gap-7 rounded-lg">
      <InputText
        title="議題名稱"
        placeholder="議題名稱"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentIssue.title"
      />
      <InputTextarea
        input-classes="h-80"
        title="議題描述"
        placeholder="議題描述"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentIssue.description"
      />
    </div>
    <div
      v-if="'createdAt' in currentIssue && 'updatedAt' in currentIssue"
      class="flex items-center justify-center gap-2"
    >
      <div>建立時間：{{ format(currentIssue.createdAt, 'yyyy-MM-dd') }}</div>
      <div>建立時間：{{ format(currentIssue.updatedAt, 'yyyy-MM-dd') }}</div>
    </div>
    <IssueActionsNew v-if="state.name === CardStates.New.name" />
    <IssueActionsDetail v-if="state.name === CardStates.Detail.name" />
    <IssueActionsEditing v-if="state.name === CardStates.Editing.name" />
    <!-- TODO -->
    <!-- <Icon
      v-if="state.name === CardStates.Detail.name"
      @click="() => modalStore.show()"
      class="absolute right-6 top-6 cursor-pointer text-blue-950"
      name="material-symbols:pan-zoom-rounded"
      size="3rem"
    /> -->
  </form>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';
import { User } from '@/types/user';

const route = useRoute();
const router = useRouter();
const workshopId = route.params.workshopId as string;

const workshopStore = useWorkshopStore();
const cardStore = useIssueCardStore();
const modalStore = useModalStore();
const { user, getTokenSilently } = await useAuth();
const { currentIssue, state, activeId } = storeToRefs(cardStore);

const handleSubmit = async (e: Event) => {
  try {
    const token = await getTokenSilently();

    switch (state.value.name) {
      case CardStates.New.name:
        const createdIssue = await cardStore.submit(token, workshopId);

        createdIssue.creator = user.value as User;
        console.log('created issue: ', createdIssue);
        workshopStore.upsert(createdIssue);

        cardStore.setActiveIssue(createdIssue);
        cardStore.setCurrentIssue(createdIssue);
        state.value = CardStates.Detail;
        break;

      case CardStates.Detail.name:
        if (!activeId.value) {
          throw new Error('No active issue to remove');
        }

        await cardStore.remove(token, activeId.value);
        workshopStore.remove(activeId.value);
        state.value = CardStates.New;
        console.log('issue removed');
        break;

      case CardStates.Editing.name:
        if (!activeId.value) {
          throw new Error('No active issue to edit');
        }

        const editedIssue = await cardStore.edit(token, activeId.value);
        editedIssue.creator = user.value as User;
        console.log('edited issue: ', editedIssue);
        workshopStore.upsert(editedIssue);

        cardStore.setActiveIssue(editedIssue);
        cardStore.setCurrentIssue(editedIssue);
        state.value = CardStates.Detail;
        break;

      default:
        throw new Error(`Unknown state: ${state.value.name}`);
    }
  } catch (e) {
    console.error(e);
  }

  // if (state.value.name === CardStates.Detail.name) {
  //   router.push(
  //     `${route.fullPath.replace(/\/+$/, '')}/issue/${activeId}/personas`
  //   );
  //   return;
  // }

  // try {
  //   const token = await getTokenSilently();

  //   if (state.value.name === CardStates.New.name) {
  //     const createdIssue = await cardStore.submit(token, workshopId);

  //     createdIssue.creator = user.value as User;
  //     workshopStore.push(createdIssue);
  //     console.log('created issue: ', createdIssue);

  //     cardStore.setActiveIssue(createdIssue);
  //     cardStore.setCurrentIssue(createdIssue);
  //     state.value = CardStates.Detail;
  //   } else {
  //     await cardStore.edit(token);
  //   }
  // } catch (e) {
  //   // TODO: make helper for better UX
  //   console.error(e);
  // }
};
</script>
