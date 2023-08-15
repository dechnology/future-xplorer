<template>
  <form
    @submit.prevent="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">
        工作坊{{ state.formTitle }}
      </h3>
      <div class="text-sm text-gray-500">
        <span>建立者：</span>
        <span v-if="'creator' in currentWorkshop">
          {{ currentWorkshop.creator.name }}
        </span>
        <span v-else-if="state.name === CardStates.New.name && user">
          {{ user.name }}
        </span>
        <span v-else> Unknown </span>
      </div>
    </div>
    <div class="flex flex-col gap-7 rounded-lg">
      <InputText
        title="工作坊名稱"
        placeholder="工作坊名稱"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentWorkshop.name"
      />
      <InputText
        title="工作坊描述"
        placeholder="工作坊描述"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentWorkshop.description"
      />
      <InputDatePicker
        i18n="zh-tw"
        separator=" - "
        :formatter="{ date: 'YYYY/MM/DD' }"
        v-model:dateValue="currentWorkshop.dateValue"
      />
      <div class="text-center">預先設定工作坊POEMS分類</div>
      <InputChips
        title="Object - 物件 or 技術"
        v-model:chips="currentWorkshop.objects"
      />
      <InputChips
        title="Environment - 環境 or 場景"
        v-model:chips="currentWorkshop.environments"
      />
      <InputChips
        title="Message - 訊息 or 目標"
        v-model:chips="currentWorkshop.messages"
      />
      <InputChips
        title="Service - 服務、行動 or 經驗"
        v-model:chips="currentWorkshop.services"
      />
    </div>
    <div
      v-if="'createdAt' in currentWorkshop && 'updatedAt' in currentWorkshop"
      class="flex items-center justify-center gap-2"
    >
      <div>建立時間：{{ formatDate(currentWorkshop.createdAt) }}</div>
      <div>更新時間：{{ formatDate(currentWorkshop.updatedAt) }}</div>
    </div>
    <WorkshopActionsNew v-if="state.name === CardStates.New.name" />
    <WorkshopActionsDetail v-if="state.name === CardStates.Detail.name" />
    <WorkshopActionsEditing v-if="state.name === CardStates.Editing.name" />
  </form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';
import { User } from '@/types/user';

const route = useRoute();
const router = useRouter();

const breadcrumbStore = useBreadcrumbStore();
const workshopsStore = useWorkshopsStore();
const cardStore = useWorkshopCardStore();
const { user, getTokenSilently } = await useAuth();
const { activeId, currentWorkshop, state } = storeToRefs(cardStore);

breadcrumbStore.clearWorkshop();
breadcrumbStore.clearIssue();

const handleSubmit = async () => {
  try {
    const token = await getTokenSilently();

    switch (state.value.name) {
      case CardStates.New.name:
        const createdWorkshop = await cardStore.submit(token);

        createdWorkshop.creator = user.value as User;
        console.log('created workshop: ', createdWorkshop);
        workshopsStore.upsert(createdWorkshop);

        cardStore.setActiveId(createdWorkshop._id);
        cardStore.setCurrentWorkshop(createdWorkshop);
        state.value = CardStates.Detail;
        break;

      case CardStates.Detail.name:
        if (!activeId.value) {
          throw new Error('No active workshop to remove');
        }

        await cardStore.remove(token, activeId.value);
        workshopsStore.remove(activeId.value);
        state.value = CardStates.New;
        console.log('workshop removed');
        break;

      case CardStates.Editing.name:
        if (!activeId.value) {
          throw new Error('No active workshop to edit');
        }

        const editedWorkshop = await cardStore.edit(token, activeId.value);
        editedWorkshop.creator = user.value as User;
        console.log('edited workshop: ', editedWorkshop);
        workshopsStore.upsert(editedWorkshop);

        cardStore.setActiveId(editedWorkshop._id);
        cardStore.setCurrentWorkshop(editedWorkshop);
        state.value = CardStates.Detail;
        break;

      default:
        throw new Error(`Unknown state: ${state.value.name}`);
    }
  } catch (e) {
    console.error(e);
  }
};
</script>
