import { getWorkshops } from '@/server/utils/fake';

export default defineEventHandler((event) => getWorkshops(10));
