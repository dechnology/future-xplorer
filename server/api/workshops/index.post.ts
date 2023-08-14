import { H3Error } from 'h3';
import WorkshopModel from '@/server/models/workshop';
import UserModel from '@/server/models/user';
import { generateToken } from '@/server/utils/token';
import { Role } from '@/types/user';

export default defineEventHandler(async (event) => {
  try {
    const { id } = authenticate(event.context);
    const { uid, name } = (await readBody(event)) as {
      uid: string;
      name: string;
    };
    const userData = await UserModel.findById(id);
    const workshopData = await WorkshopModel.create();
    return { workshopData };
  } catch (e) {
    if (e instanceof H3Error) {
      throw e;
    } else {
      throw createError({
        statusCode: 501,
        statusMessage: `Uncaught error: ${e}`,
      });
    }
  }
});
