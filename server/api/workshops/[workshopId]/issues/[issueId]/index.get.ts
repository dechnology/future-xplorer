import { Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';

export default defineEventHandler((event) => {
  return {
    workshop: getWorkshops(1).pop() as Workshop,
    issue: getIssues(1).pop() as Issue,
  };
});
