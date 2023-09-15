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
              class="mx-auto w-fit rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-indigo-600"
              @click.prevent="handleImageGenerations"
            >
              選擇故事
            </CardButton>
            <InputComponent
              v-model="currentIllustration.story"
              type="textarea"
              title="故事內容"
              placeholder="故事內容"
              :disabled="formDisabled"
              input-classes="h-[200px]"
            />
            <div class="flex flex-col items-center">
              <CardButton
                class="rounded-lg bg-lime-600 px-8 py-3 text-white transition-all hover:bg-lime-700"
                body="Prompt"
                @click.prevent="handleImageGenerations"
              >
                <span>PROMPT</span>
                <Icon
                  name="material-symbols:double-arrow"
                  size="2.5rem"
                  class="rotate-90"
                />
              </CardButton>
            </div>
            <InputComponent
              v-model="currentIllustration.prompt"
              type="textarea"
              title="Prompt"
              placeholder="情境圖 prompt"
              :disabled="formDisabled"
              input-classes="h-[200px]"
            />
            <div
              class="flex w-full items-center justify-center gap-6 px-4 text-base font-normal leading-relaxed text-black"
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
              class="mx-auto w-fit rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-indigo-600"
              @click.prevent="handleImageGenerations"
            >
              情境圖生成
            </CardButton>
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <CardGallery :grid-cols="4">
        <Card
          v-for="el in illustrations"
          :key="el._id"
          class="h-[350px]"
          @dblclick="() => handleDblclick()"
          @click="() => stores.illustration.changeActiveIllustration(el)"
        >
          <template #image>
            <CardImage :url="el.image" />
          </template>
          <CardDescription classes="text-sm font-medium">
            {{
              [`Prompt：${el.prompt}`, `建立者：${el.creator.name}`].join('\n')
            }}
          </CardDescription>
        </Card>
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Illustration, NewIllustrationSchema, type User } from '~/types';

const gojoImage =
  'https://fictionhorizon.com/wp-content/uploads/2023/06/Gojo1.jpg';

const formPanelProps = {
  title: '情境圖',
  description:
    '第五步從一張張的情境故事(poems)中選擇一張或彙整出一張形成最終的未來情境文字描述(一句話)',
};

const { user, username, userId, getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  persona: usePersonaStore(),
  keyword: useKeywordStore(),
  illustration: useIllustrationStore(),
};
const { loading, illustrations, activeId, currentIllustration, formDisabled } =
  storeToRefs(stores.illustration);
const { issueId } = storeToRefs(stores.issue);

const numberToGenerate = ref(1);

const imageGeneration = async () => {
  try {
    loading.value = true;

    console.log(currentIllustration.value);

    const token = await getTokenSilently();
    const illustration = NewIllustrationSchema.parse(currentIllustration.value);

    console.log('Creating: ', illustration);
    const { data: createdIllustration } = await fetchResource<Illustration>(
      token,
      `/api/issues/${issueId.value}/illustrations`,
      {
        method: 'post',
        body: {
          ...illustration,
          image: gojoImage, // Change this to generated image
        },
      }
    );

    createdIllustration.creator = user.value as User;

    console.log('Created: ', createdIllustration);
    stores.illustration.upsertIllustration(createdIllustration);
    stores.illustration.changeActiveIllustration(createdIllustration);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleImageGenerations = async () => {
  // Old-school whileloop lol: to be optimized
  let i = 0;
  while (i < numberToGenerate.value) {
    await imageGeneration();
    i++;
  }
};

const handleDblclick = () => {
  stores.modal.show();
};
</script>
