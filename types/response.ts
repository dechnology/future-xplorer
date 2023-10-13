export type ResourceObject<T> = {
  message?: string;
  data: T;
};

export interface PromptResponseBody {
  prompt: string;
}
