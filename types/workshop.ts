import { Base } from '@/types/base';
import { User } from '@/types/user';

export interface DateValue {
  start: string;
  end: string;
}

export interface NewWorkshop {
  name: string;
  description: string;
  dateValue: DateValue;
  objects: string[];
  environments: string[];
  messages: string[];
  services: string[];
}

export type Workshop = Base & NewWorkshop;
