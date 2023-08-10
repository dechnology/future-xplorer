import { Issue } from '@/types/issue';
import { BaseWorkshop } from '@/types/workshop';

export default defineEventHandler(
  (event): { workshop: BaseWorkshop; issue: Issue } => ({
    workshop: getBaseWorkshop(),
    issue: getIssue(),
  })
);
