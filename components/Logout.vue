<template>
  <div
    class="flex cursor-pointer items-center text-white transition-all hover:text-gray-300"
    @click="handleLogout"
  >
    <Icon v-if="showIcon" class="h-4 w-4 md:h-6 md:w-6" name="mdi:logout" />
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ showIcon?: boolean }>(), { showIcon: true });

const handleLogout = async () => {
  const router = useRouter();
  const { logout } = useAuth();
  await logout();
  router.push('/login');
};
</script>
