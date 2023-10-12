import { ImageStatesType } from '~/types';

export const ImageStates: ImageStatesType = {
  IDLE: {
    hint: '請點擊上傳圖片',
    iconName: 'material-symbols:add-photo-alternate',
  },
  NONE: {
    hint: '本資源無圖片',
    iconName: 'material-symbols:image',
  },
  PROMPTING: {
    hint: '人物提示詞產生中',
    iconName: 'svg-spinners:dot-revolve',
  },
  GENERATING: {
    hint: '人物圖片生成中',
    iconName: 'svg-spinners:dot-revolve',
  },
  ERROR: {
    hint: '圖片發生錯誤',
    iconName: 'line-md:alert-square',
  },
} as const;
