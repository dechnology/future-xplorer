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
                  class="h-8 w-8 rotate-90 xl:h-14 xl:w-14"
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
    <CardGalleryPanel @search="handleSearch">
      <CardGallery :grid-cols="4">
        <Card
          v-for="el in illustrations"
          :key="el._id"
          class="max-h-[200px] min-h-[150px] xl:max-h-[400px] xl:min-h-[350px]"
          @dblclick="() => handleDblclick(el)"
          @click="() => (currentIllustration = cloneDeep(el))"
        >
          <template #image>
            <CardImage :url="el.image" :download="true" />
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
</template>

<script setup lang="ts">
import cloneDeep from 'lodash/cloneDeep';
import { Illustration, NewIllustrationSchema } from '~/types';

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
  try {
    loading.value = true;

    const el = NewIllustrationSchema.parse(currentIllustration.value);

    let token = await getTokenSilently();
    const { image } = await generateImage(token, {
      prompt: el.prompt,
    });
    const { data: imageUrl } = await uploadImageUrl(token, image);
    console.log('Image url: ', imageUrl);

    token = await getTokenSilently();
    const { data: createdIllustration } = await fetchResource<Illustration>(
      token,
      `/api/issues/${issueId.value}/illustrations`,
      {
        method: 'post',
        body: {
          ...el,
          image: imageUrl,
        },
      }
    );
    console.log('Created: ', createdIllustration);

    token = await getTokenSilently();
    await stores.illustration.update(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleImageGenerations = async () => {
  if (currentIllustration.value.prompt.trim() === '') {
    console.error('no prompt');
    return;
  }

  const promises: Promise<void>[] = [];

  console.log(
    `Creating ${numberToGenerate.value} illustration with prompt: `,
    currentIllustration.value.prompt
  );

  for (let i = 0; i < numberToGenerate.value; i++) {
    promises.push(imageGeneration());
  }

  await Promise.all(promises);
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

const handleSearch = async (value: string) => {
  searchQuery.value = value;

  const token = await getTokenSilently();
  stores.illustration.update(token);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await Promise.all([
    stores.story.init(token),
    stores.illustration.init(token),
  ]);
});
</script>
