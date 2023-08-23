import type { NewCase, Case, ResourceObject } from '@/types';
import { CaseModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Case>> => {
    authenticate(event.context);
    const caseId = getRouterParam(event, 'case');
    const newCase: NewCase = await readBody(event);
    const studyCase = await CaseModel.findByIdAndUpdate(caseId, newCase, {
      new: true,
    });

    if (!studyCase) {
      throw Error('Case update failed');
    }
    return { data: studyCase };
  }
);
