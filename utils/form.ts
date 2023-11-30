import { fakerZH_TW } from '@faker-js/faker';
import { format } from 'date-fns';
import {
  FormState,
  FormStateKey,
  NewCase,
  NewIssue,
  NewKeyword,
  NewPersona,
  NewPoemsTemplate,
  NewStory,
  NewWorkshop,
  StoryContext,
  User,
} from '~/types';
import { NewIllustration } from '~/types/illustration';

const formStatesCache: Record<string, FormState> = {};

export const FormStates = (resourceName: string) => {
  if (!formStatesCache[resourceName]) {
    formStatesCache[resourceName] = {
      NEW: {
        formTitle: `新增${resourceName}`,
      },
      DETAILS: {
        formTitle: `${resourceName}資訊`,
      },
      EDITING: {
        formTitle: `${resourceName}編輯`,
      },
      MULTIPLE: {
        formTitle: `${resourceName}多選`,
      },
    } as const;
  }

  return formStatesCache[resourceName];
};

export const getCurrentFormCardProps = (
  resourceName: string,
  currentResourceInfo: { creator?: User; createdAt?: Date; updatedAt?: Date },
  state: FormStateKey
) => {
  const { creator, createdAt, updatedAt } = currentResourceInfo;
  const timestamps = createdAt && updatedAt && { createdAt, updatedAt };

  return {
    formTitle: FormStates(resourceName)[state].formTitle,
    creator,
    timestamps,
  };
};

export const getNewWorkshop = (): NewWorkshop => {
  const now = format(new Date(), 'yyyy/MM/dd');

  return {
    name: '',
    description: '',

    dateValue: {
      start: now,
      end: now,
    },

    objects: ['技術'],
    environments: ['場景體驗'],
    messages: ['洞見與價值'],
    services: ['使用者體驗'],
  };
};

export const getDefaultWorkshop = (): NewWorkshop => {
  const now = format(new Date(), 'yyyy/MM/dd');

  return {
    name: '預設工作坊名稱',
    description: '預設工作坊描述',

    dateValue: {
      start: now,
      end: now,
    },

    objects: ['技術'],
    environments: ['場景體驗'],
    messages: ['洞見與價值'],
    services: ['使用者體驗'],
  };
};

export const getNewIssue = (): NewIssue => ({
  title: '',
  description: '',
});

export const getDefaultIssue = (): NewIssue => ({
  title: '預設議題標題',
  description: '預設議題描述',
});

export const getNewPersona = (): NewPersona => ({
  role: '',
  name: '',
  age: '',
  trait: '',
  gender: 'male',
  other: '',
  image: null,
});

export const PersonaPresets = {
  role: ['教師', '學生', '媽媽', '爸爸'],
  gender: [
    { name: '男', data: 'male' },
    { name: '女', data: 'female' },
  ],
  age: ['青少年', 'Z世代 (Gen Z)', '老人'],
  trait: [
    '行為數位化',
    '資訊素養高',
    '環境意識高',
    '習慣科技運用',
    '需關注心理健康',
  ],
} as const;

export const getRandomNewPersona = (): NewPersona => ({
  role: fakerZH_TW.helpers.arrayElement(PersonaPresets.role),
  name: fakerZH_TW.person.fullName(),
  age: fakerZH_TW.helpers.arrayElement(PersonaPresets.age),
  trait: fakerZH_TW.helpers.arrayElement(PersonaPresets.trait),
  gender: fakerZH_TW.helpers.arrayElement(
    PersonaPresets.gender.map((g) => g.data)
  ),
  other: '',
  image: null,
});

export const getNewCase = (): NewCase => ({
  title: '',
  background: '',
  method: '',
  goal: '',
  challenge: '',
  result: '',
  reference: '',
  other: '',
  image: null,
});

export const getDefaultCase = (): NewCase => ({
  title: '預設案例標題',
  background: '預設案例背景',
  method: '預設案例方法',
  goal: '預設案例目標',
  challenge: '預設案例挑戰',
  result: '預設案例結果',
  reference: '預設案例參考資料',
  other: '預設案例其他',
  image: null,
});

export const getNewKeyword = (): NewKeyword => ({
  body: '',
});

export const getNewPoemsTemplate = (): NewPoemsTemplate => ({
  title: '',
  object: '',
  environment: '',
  message: '',
  service: '',
});

export const getNewStory = (): NewStory => ({
  title: '',
  content: '',
});

export const getNewStoryContext = (): StoryContext => ({
  object: '',
  environment: '',
  message: '',
  service: '',
});

export const getNewIllustration = (): NewIllustration => ({
  story: '',
  prompt: '',
});
