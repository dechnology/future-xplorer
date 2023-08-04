import { getIssues } from '@/server/utils/fake';
export default defineEventHandler((event) => getIssues(10));
