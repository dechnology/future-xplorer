import { getWorkshops } from '@/server/utils/fake';

export default defineEventHandler((event) => getBaseWorkshops(10));
