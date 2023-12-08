<template>
  <NuxtLayout>
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
          </PanelHeader>
        </template>
        <FormCard>
          <template #body>
            <CardButton
              class="mx-auto w-fit rounded-lg bg-indigo-500 text-white transition-all hover:bg-indigo-600"
              @click.prevent="handleStoryModalOpen"
            >
              選擇故事
            </CardButton>
            <InputComponent
              v-model="currentIllustration.story"
              type="textarea"
              title="故事內容"
              placeholder="故事內容"
              :disabled="formDisabled"
              input-classes="h-[100px] xl:h-[200px]"
            />
            <div class="flex flex-col items-center">
              <CardButton
                class="rounded-lg bg-lime-600 font-medium text-white transition-all hover:bg-lime-700"
                body="Prompt"
                :disabled="formDisabled"
                @click.prevent="handlePromptGeneration"
              >
                <span>PROMPT</span>
                <Icon
                  name="material-symbols:double-arrow"
                  class="h-8 w-8 rotate-90 xl:h-12 xl:w-12"
                />
              </CardButton>
            </div>
            <InputComponent
              v-model="currentIllustration.prompt"
              :disabled="formDisabled"
              type="textarea"
              title="Prompt"
              placeholder="情境圖 prompt"
              input-classes="h-[100px] xl:h-[200px]"
            />
            <div
              class="flex w-full items-center justify-center gap-3 px-4 text-xs font-normal leading-relaxed text-black xl:gap-6 xl:text-base"
            >
              <div>使用這個Prompt一次新增</div>
              <InputRange
                v-model="numberToGenerate"
                :min="1"
                :max="4"
                :step="1"
              />
              <div>張圖</div>
            </div>
            <CardButton
              class="mx-auto w-fit rounded-lg bg-indigo-500 text-white transition-all hover:bg-indigo-600"
              :disabled="formDisabled"
              @click.prevent="handleImageGenerations"
            >
              情境圖生成
            </CardButton>
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <InputSearchBar v-model="searchQuery" @search="handleSearch" />
      <CardGallery :grid-cols="4">
        <Card
          v-for="el in illustrations"
          :key="el._id"
          class="max-h-[200px] min-h-[150px] xl:max-h-[400px] xl:min-h-[350px]"
          @dblclick="() => handleDblclick(el)"
          @click="() => (currentIllustration = cloneDeep(el))"
        >
          <template #image>
            <CardImage
              v-if="el.image || el.status == 'done'"
              :url="el.image"
              :download="true"
            >
              <button
                v-if="el.image"
                class="absolute bottom-2 right-2 origin-bottom-right transition-all hover:scale-125"
                @click="() => downloadImage(el)"
              >
                <Icon
                  name="mdi:download"
                  class="h-6 w-6 cursor-pointer stroke-white text-slate-700 xl:h-8 xl:w-8"
                />
              </button>
            </CardImage>
            <div v-else class="h-24 w-full shrink-0 animate-pulse xl:h-40">
              <div
                class="flex h-full w-full items-center justify-center bg-slate-200"
              >
                <Icon
                  name="eos-icons:bubble-loading"
                  class="h-6 w-6 text-slate-700 xl:h-12 xl:w-12"
                />
              </div>
            </div>
          </template>
          <CardDescription classes="text-sm font-medium">
            {{
              [`Prompt: ${el.prompt}`, `建立者：${el.creator.name}`].join('\n')
            }}
          </CardDescription>
        </Card>
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
  <IllustrationModal :modal-state="modalState" />
  <ConfirmationModal
    :loading="loading"
    :signal="confirmModalSignal"
    @confirm="confirmModalSignal = !confirmModalSignal"
  >
    <div class="flex flex-col gap-4">
      <h3 class="text-lg">情境圖產製錯誤...</h3>
      <p class="whitespace-pre-wrap text-sm text-gray-500">
        {{ confirmModalText }}
      </p>
    </div>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import cloneDeep from 'lodash/cloneDeep';
import { Illustration, NewIllustrationSchema } from '~/types';
import { fetchIllustrationBlob } from '~/utils/db';

const formPanelProps = {
  title: '情境圖',
  description:
    '第五步從一張張的情境故事(poems)中選擇一張或彙整出一張形成最終的未來情境文字描述(一句話)',
};

const { getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  story: useStoryStore(),
  illustration: useIllustrationStore(),
};
const { workshop, issue, issueId } = storeToRefs(stores.issue);
const {
  searchQuery,
  illustrations,
  currentIllustration,
  activeIllustration,
  formDisabled,
  loading,
} = storeToRefs(stores.illustration);

const numberToGenerate = ref(1);
const modalState = ref<'stories' | 'illustration'>('stories');
const confirmModalSignal = ref(false);
const confirmModalText = ref('');

const handlePromptGeneration = async () => {
  try {
    loading.value = true;

    if (!workshop.value || !issue.value || !currentIllustration.value.story) {
      throw new Error('Invalid workshop, issue or story');
    }

    const token = await getTokenSilently();
    const { prompt } = await generateIllustrationPrompt(token, {
      workshop: workshop.value,
      issue: issue.value,
      story: currentIllustration.value.story,
    });

    console.log('Illustration prompt: ', prompt);

    currentIllustration.value.prompt = prompt;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const imageGeneration = async () => {
  const el = NewIllustrationSchema.parse(currentIllustration.value);

  let token = await getTokenSilently();
  const { data: createdIllustration } = await fetchResource<Illustration>(
    token,
    `/api/issues/${issueId.value}/illustrations?now=${Date.now()}`,
    {
      method: 'post',
      body: {
        status: 'empty',
        ...el,
      },
    }
  );
  illustrations.value.unshift(createdIllustration);

  token = await getTokenSilently();
  const { data: generatedIllustration } = await fetchResource<Illustration>(
    token,
    `/api/illustrations/${createdIllustration._id}/generate`,
    {
      method: 'put',
    }
  );
  console.log('Generated: ', generatedIllustration);

  token = await getTokenSilently();
  await stores.illustration.update(token);
};

const handleImageGenerations = async () => {
  try {
    loading.value = true;
    if (currentIllustration.value.prompt.trim() === '') {
      console.error('no prompt');
      return;
    }

    const promises: Promise<void>[] = [];

    console.log(
      `Creating ${numberToGenerate.value} illustration with prompt: ${currentIllustration.value.prompt}`
    );

    for (let i = 0; i < numberToGenerate.value; i++) {
      promises.push(imageGeneration());
    }

    const results = await Promise.allSettled(promises);

    const token = await getTokenSilently();
    await stores.illustration.update(token);

    const rejections = results.filter(
      (el) => el.status === 'rejected'
    ) as PromiseRejectedResult[];
    if (rejections.length > 0) {
      confirmModalSignal.value = !confirmModalSignal.value;
      confirmModalText.value = `有 ${
        rejections.length
      } 張圖生成失敗，請再試一次\n錯誤訊息：\n${rejections
        .map((el) => `\t${el.reason}`)
        .join('\n')}`;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleStoryModalOpen = () => {
  modalState.value = 'stories';
  stores.modal.show();
};

const handleDblclick = (el: Illustration) => {
  activeIllustration.value = cloneDeep(el);
  modalState.value = 'illustration';
  stores.modal.show();
};

const handleSearch = async () => {
  const token = await getTokenSilently();
  stores.illustration.update(token);
};

const downloadImage = async (el: Illustration) => {
  const token = await getTokenSilently();

  const blobImage = await fetchIllustrationBlob(token, el._id);

  console.log('Blob image: ', blobImage);

  const nameOfDownload = el.image.split('/').pop();

  if (!blobImage || !nameOfDownload) {
    throw new Error('No image data or name of download');
  }

  const href = URL.createObjectURL(blobImage);

  const anchorElement = document.createElement('a');
  anchorElement.href = href;
  anchorElement.download = nameOfDownload;

  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await Promise.all([
    stores.story.init(token),
    stores.illustration.init(token),
  ]);
});
</script>
