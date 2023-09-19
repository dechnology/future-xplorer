<template>
  <div
    class="cursor-pointer text-white transition-all hover:text-gray-300"
    @click="handleLogout"
  >
    <Icon v-if="showIcon" size="1.75rem" name="mdi:logout" />
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
