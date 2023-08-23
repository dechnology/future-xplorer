import { Base } from '@/types/base';
import { z } from 'zod';

export const DataValueSchema = z.object({
  start: z.string().trim().nonempty(),
  end: z.string().trim().nonempty(),
});

export type DateValue = z.infer<typeof DataValueSchema>;

export const WorkshopElementsSchema = z.object({
  objects: z.string().trim().nonempty().array().nonempty(),
  environments: z.string().trim().nonempty().array().nonempty(),
  messages: z.string().trim().nonempty().array().nonempty(),
  services: z.string().trim().nonempty().array().nonempty(),
});

export type WorkshopElements = z.infer<typeof WorkshopElementsSchema>;

export const NewWorkshopSchema = WorkshopElementsSchema.extend({
  name: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
  dateValue: DataValueSchema,
});

export type NewWorkshop = z.infer<typeof NewWorkshopSchema>;

export type Workshop = Base & NewWorkshop;
