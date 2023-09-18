import type { Case, ResourceObject } from '@/types';
import { CaseModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Case>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const studyCase = await CaseModel.findByIdAndDelete(id);

    if (!studyCase) {
      throw createError({
        statusCode: 400,
        statusMessage: 'issue does not exist',
      });
    }

    return {
      message: 'case successfully deleted',
      data: studyCase,
    };
  }
);
