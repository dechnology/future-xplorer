import type { NewCase, Case, ResourceObject } from '@/types';
import { CaseModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Case>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newCase: NewCase = await readBody(event);
    const studyCase = await CaseModel.findByIdAndUpdate(id, newCase, {
      new: true,
    });

    if (!studyCase) {
      throw new Error('Case update failed');
    }
    return { data: studyCase };
  }
);
