import { Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';

export default defineEventHandler(
  (event): { workshop: Workshop; issue: Issue } => ({
    workshop: getWorkshop(),
    issue: getIssue(),
  })
);
