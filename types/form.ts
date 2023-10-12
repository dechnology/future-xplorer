export type FormStateKey = 'NEW' | 'DETAILS' | 'EDITING' | 'MULTIPLE';

export type FormState = {
  [K in FormStateKey]: { formTitle: string };
};

export interface FormPanelProps {
  title: string;
  description: string;
}

export interface SelectOption<T> {
  name: string;
  data: T;
}
