<template>
  <CardGallery>
    <Card
      :active="!activeId"
      @click="() => stores.workshop.changeActiveIssue()"
    >
      <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }"> 新增議題 </CardIcon>
    </Card>
    <!-- Should be async component -->
    <Card
      v-for="i in issues"
      :active="activeId === i._id"
      @dblclick="() => handleDblclick(i._id)"
      @click="() => stores.workshop.changeActiveIssue(i)"
    >
      <CardTitle>{{ i.title }} </CardTitle>
      <CardDescription>{{ i.description }} </CardDescription>
      <CardFootnote>
        {{
          [
            `建立者：${i.creator.name}`,
            `新增日期：${formatDate(i.createdAt)}`,
            `更新日期：${formatDate(i.updatedAt)}`,
          ].join('\n')
        }}
      </CardFootnote>
    </Card>
    <!-- Should be async component (end) -->
  </CardGallery>
  <!-- <div class="grid grid-cols-4 gap-4 rounded-2xl">
    <IconCard
      @click="() => handleClick()"
      class="h-[350px]"
      :isActivated="activeId === null"
      :icon="{ name: 'mdi:plus', size: '5rem' }"
      text="新增角色"
    />
    <Card
      v-for="p in personas"
      :key="p._id"
      @click="() => handleClick(p)"
      class="h-[350px]"
      :isActivated="p._id === activeId"
      :image="p.image"
      :lines="[
        `角色：${p.role}`,
        `姓名：${p.name}`,
        `性別：${p.gender}`,
        `年齡：${p.age}`,
        `特徵：${p.trait}`,
      ]"
      :footnotes="[`建立者：${p.creator.name}`]"
    />
  </div> -->
</template>

<script setup lang="ts">
const { getTokenSilently } = useAuth();
const route = useRoute();
const router = useRouter();

const stores = {
  issue: useIssueStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const { workshop, personas, state, formDisabled } = storeToRefs(stores.issue);

const handleDblclick = (issueId: string) => {
  // TODO: open modal
};

onMounted(async () => {
  // const token = await getTokenSilently();
  // const workshopId = route.params.workshopId as string;
  // await stores.workshop.init(token, workshopId);
  // stores.breadcrumbs.clearIssue();
  // if (workshop.value) {
  //   stores.breadcrumbs.setWorkshop(workshop.value.name, route.fullPath);
  // }
});
</script>
