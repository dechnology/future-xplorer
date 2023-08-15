interface Breadcrumb {
  name: string;
  path: string;
}

export const useBreadcrumbStore = definePiniaStore('breadcrumb', () => {
  const workshop = ref<Breadcrumb | null>(null);
  const issue = ref<Breadcrumb | null>(null);

  const backPath = computed(() => {
    if (!workshop.value && !issue.value) {
      return null;
    }
    if (workshop.value && !issue.value) {
      return '/';
    }
    if (workshop.value && issue.value) {
      return workshop.value.path;
    }
  });

  function clearWorkshop() {
    workshop.value = null;
  }

  function clearIssue() {
    issue.value = null;
  }

  function setWorkshop(name: string, path: string) {
    workshop.value = { name, path };
  }

  function setIssue(name: string, path: string) {
    issue.value = { name, path };
  }

  return {
    workshop,
    issue,
    backPath,
    clearWorkshop,
    clearIssue,
    setWorkshop,
    setIssue,
  };
});
