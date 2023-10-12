export type ImageStateKey =
  | 'NONE'
  | 'IDLE'
  | 'PROMPTING'
  | 'GENERATING'
  | 'ERROR';

export type ImageStatesType = {
  [K in ImageStateKey]: { hint: string; iconName: string };
};
