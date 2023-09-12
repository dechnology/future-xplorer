import { fakerZH_TW } from '@faker-js/faker';
import { format } from 'date-fns';
import {
  FormState,
  FormStateKeys,
  NewCase,
  NewIssue,
  NewKeyword,
  NewPersona,
  NewPoemsTemplate,
  NewWorkshop,
  User,
} from '~/types';

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
    } as const;
  }

  return formStatesCache[resourceName];
};

export const getCurrentFormCardProps = (
  resourceName: string,
  currentResourceInfo: { creator?: User; createdAt?: Date; updatedAt?: Date },
  state: FormStateKeys
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

export const getNewIssue = (): NewIssue => ({
  title: '',
  description: '',
});

export const getNewPersona = (): NewPersona => ({
  role: '',
  name: '',
  age: '',
  trait: '',
  gender: '',
  other: '',
  image: null,
});

export const PersonaPresets = {
  role: ['教師', '學生', '媽媽', '爸爸'],
  gender: ['male', 'female'],
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
  gender: fakerZH_TW.helpers.arrayElement(PersonaPresets.gender),
  other: '',
  image: null,
});

export const getNewCase = (): NewCase => ({
  title: 'testing title',
  background: 'some bg...',
  method: 'some methods',
  goal: 'goals and stuffs',
  challenge: 'some challenges',
  result: 'some results',
  reference: 'https://www.google.com',
  other: '',
  // title: '',
  // background: '',
  // method: '',
  // goal: '',
  // challenge: '',
  // result: '',
  // reference: '',
  // other: '',
  image: null,
});

export const getNewKeyword = (): NewKeyword => ({
  body: '',
});

export const getNewPoemsTemplate = (): NewPoemsTemplate => ({
  title: '',
  content: '',
  persona: '',
  object: '',
  environment: '',
  message: '',
  service: '',
});
