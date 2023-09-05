export type FormStateKeys = 'NEW' | 'DETAILS' | 'EDITING';

export type FormState = {
  [K in FormStateKeys]: { formTitle: string };
};

export interface FormPanelProps {
  title: string;
  description: string;
}
