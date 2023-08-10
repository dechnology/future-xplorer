import { BaseWorkshop } from '@/types/workshop';

export default defineEventHandler(
  (event): { baseWorkshops: BaseWorkshop[] } => ({
    baseWorkshops: getBaseWorkshops(30),
  })
);
