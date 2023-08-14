import { H3Error } from 'h3';
import { Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';
import WorkshopModel from '@/server/models/workshop';
import IssueModel from '@/server/models/issue';

export default defineEventHandler(
  async (event): Promise<{ workshop: Workshop }> => {
    authenticate(event.context);
    const workshop = await WorkshopModel.findById(
      event.context.params?.workshopId
    );
    if (!workshop) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workshop does not exist',
      });
    }
    return { workshop };
  }
);
