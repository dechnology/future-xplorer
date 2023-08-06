import { Workshop } from '@/types/workshop';

export default defineEventHandler((event) => ({
  workshop: getWorkshops(1).pop() as Workshop,
  issues: getIssues(10),
}));
