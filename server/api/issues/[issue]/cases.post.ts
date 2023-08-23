import { CaseModel } from '@/server/models';
import { ResourceObject, NewCase, Case } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Case>> => {
    const { id: creator } = authenticate(event.context);
    const issue = getRouterParam(event, 'issue');

    const newCase: NewCase = await readBody(event);

    // naming this studyCase to avoid collision with preserved keyword "case"
    const studyCase = await CaseModel.create({
      creator,
      issue,
      ...newCase,
    });

    if (!studyCase) {
      throw Error('Case creation failed');
    }
    return { data: studyCase };
  }
);
