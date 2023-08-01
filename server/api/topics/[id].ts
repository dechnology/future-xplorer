export default defineEventHandler((event) => ({
  id: event.context?.params?.id,
  title: '場次標題範例',
  creator: '場次作者範例',
  createdAt: new Date(2000, 10, 7),
  updatedAt: new Date(),
  locked: false,
}));
