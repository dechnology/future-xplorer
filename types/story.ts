import { z } from 'zod';
import { Base, Issue, NewPersonaSchema } from '@/types';

export const StoryContextSchema = z.object({
  persona: NewPersonaSchema.omit({ image: true }),
  object: z.string().trim().nonempty(),
  environment: z.string().trim().nonempty(),
  message: z.string().trim().nonempty(),
  service: z.string().trim().nonempty(),
});

export type StoryContext = z.infer<typeof StoryContextSchema>;

export const NewStorySchema = z.object({
  title: z.string().trim().nonempty(),
  content: z.string().trim().nonempty(),
  context: StoryContextSchema,
});

export type NewStory = z.infer<typeof NewStorySchema>;

export interface Story extends Base, NewStory {
  issue: Issue | string;
}
