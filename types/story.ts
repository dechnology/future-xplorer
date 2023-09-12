import { z } from 'zod';
import { Base, Issue, Workshop } from '@/types';

export const NewStorySchema = z.object({});

export type NewStory = z.infer<typeof NewStorySchema>;

export interface Story extends Base, NewStory {
  issue: Issue | string;
}

export interface StoryContext {
  workshop: Pick<Workshop, '_id' | 'name' | 'description'>;
  issue: Pick<Issue, '_id' | 'title' | 'description'>;
}

export interface PortraitRequestBody extends StoryContext {
  persona: NewStory;
}
