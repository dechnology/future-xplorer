import { Base } from '@/types/base';

export interface Vote {
  userId: string;
  keywordId: string;
}

export interface NewKeyword {
  body: string;
}

export interface Keyword extends Base, NewKeyword {
  issueId: string;
  caseId: string;
  category?: string;
}
