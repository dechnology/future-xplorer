<template>
  <div
    class="h-full overflow-y-auto rounded-t-xl border border-solid border-slate-200"
  >
    <table class="w-full table-fixed border-collapse">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
const { username, getTokenSilently } = useAuth();
const router = useRouter();

const stores = {
  workshops: useWorkshopsStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const {
  workshops,
  currentWorkshop,
  activeId,
  state,
  formDisabled,
  currentFormCardProps,
} = storeToRefs(stores.workshops);

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.workshops.init(token);
  stores.breadcrumbs.clearAll();
});
</script>
