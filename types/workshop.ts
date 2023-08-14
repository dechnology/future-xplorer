import { Base } from '@/types/base';

export const ElementCategories = {
  object: 1,
  environment: 2,
  message: 3,
  service: 4,
} as const;

type ElementCategory = keyof typeof ElementCategories;

export interface WorkshopElement {
  readonly name: string;
  readonly category: ElementCategory;
}

export interface BaseWorkshop {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
}

export interface Workshop extends Base, BaseWorkshop {
  elements: WorkshopElement[];
}

export interface ElementGroup {
  object: string[];
  environment: string[];
  message: string[];
  service: string[];
}

export interface BaseCardWorkshop
  extends Omit<BaseWorkshop, 'startAt' | 'endAt'>,
    ElementGroup {
  dateValue: {
    start: string;
    end: string;
  };
}

export type CardWorkshop = BaseCardWorkshop & Base;
