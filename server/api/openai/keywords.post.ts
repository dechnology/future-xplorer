import {
  NewPersona,
  PersonaContext,
  PortraitRequestBody,
  Workshop,
} from '@/types';

const getSystemMessage = (ctx: PersonaContext): string => {
  return [
    'Generate keywords from the case provided.',
    `Workshop: ${ctx.workshop.name}:`,
    "'''",
    `${ctx.workshop.description}`,
    "'''",
    '',
    `In this workshop, we are discussing an issue called "${ctx.issue.title}".`,
    'Here is the description for the issue:',
    "'''",
    `${ctx.issue.description}`,
    "'''",
    '',
    'Rules: ',
    "'''",
    '1. The descriptions may be given in other languages (ex. Traditional Chinese),',
    'but however, you must give responses in English.',
    '2. Descriptions other than "name" from other languages must all be translated accrodingly to English.',
    '3. The response should be not exceed 400 words.',
    '4. The response you give must be such that the portrait contains the face of the persona.',
    '5. The responses must not be in list format. Write a short paragraphs as responses',
    '6. The portrait can only contain ONE PERSON.',
    "'''",
  ].join('\n');
};

const getUserMessage = (p: NewPersona): string => {
  return [
    'The persona description:',
    "'''",
    `name: ${p.name}`,
    `age: ${p.age}`,
    `gender: ${p.gender}`,
    `role: ${p.role}`,
    `trait: ${p.trait}`,
    `other: ${p.other}`,
    "'''",
  ].join('\n');
};

export default defineEventHandler(
  async (event): Promise<{ prompt: string }> => {
    const openai = useNitroApp().openai;
    const { persona, ...ctx }: PortraitRequestBody = await readBody(event);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(persona) },
      ],
      functions: [
        {
          name: 'extract_OEMS_keywords',
          description: '',
          parameters: {
            type: 'object',
            properties: {
              objects: {
                type: 'array',
                description: '',
                items: { type: 'string' },
              },
              environments: {
                type: 'array',
                description: '',
                items: { type: 'string' },
              },
              messages: {
                type: 'array',
                description: '',
                items: { type: 'string' },
              },
              services: {
                type: 'array',
                description: '',
                items: { type: 'string' },
              },
            },
            required: ['objects', 'environments', 'messages', 'services'],
          },
        },
      ],
    });

    if (!response.data.choices[0].message) {
      throw new Error(`OpenAI error: ${response}`);
    }

    if (!response.data.choices[0].message.content) {
      throw new Error(`OpenAI error: ${response}`);
    }

    return { prompt: response.data.choices[0].message.content };
  }
);

// exports.generateForCaseDataKeyword = async (req, res) => {
//   const generateData = req.body;
//   if (generateData === undefined) {
//     res.status(400).send('缺少generateData資料包');
//     return;
//   }
//   if (generateData.workshop === undefined) {
//     res.status(400).send('缺少workshop_id');
//     return;
//   }
//   if (generateData.issue === undefined) {
//     res.status(400).send('缺少issue_id');
//     return;
//   }
//   if (generateData.caseData === undefined) {
//     res.status(400).send('缺少caseData');
//     return;
//   }
//   let caseData = generateData.caseData;
//   // let toGPTPrompt = `目標：從給出的資訊中找出P(Person，人物)、O(Objec，物件)、E(Environment，環境)、M(Message，訊息、效果or體驗)、S(Service，服務)各一個最重要的。
//   // 回傳範例：{"P":"患有糖尿病的高齡婦女","O":"里民中心裡的電腦設備、血糖機","E":"在偏鄉的里民中心","M":"在空間限制下仍享有便利的就醫服務","S":"和醫生進行遠距看診"}
//   // 給出的資訊：
//   // ＊標題：${caseData.title}
//   // ＊背景介紹：${caseData.background}
//   // ＊目標：${caseData.goal}
//   // ＊作法：${caseData.approach}
//   // ＊問題與挑戰：${caseData.problemAndChanllge}
//   // ＊成果：${caseData.achievement} `

//   let toGPTPrompt = `[目標]：從給出的資訊中找出P(Person，人物)、O(Object，物件or技術)、E(Environment，環境)、M(Message，訊息、效果or體驗)、S(Service，服務)各一個最重要的，如果沒有，請回覆null。

//     [回傳範例]：{"P":"患有糖尿病的高齡婦女","O":"里民中心裡的電腦設備、血糖機","E":"在偏鄉的里民中心","M":"在空間限制下仍享有便利的就醫服務","S":null}

//     [給出的資訊]：
//     標題：${caseData.title}
//     背景介紹：${caseData.background}
//     目標：${caseData.goal}
//     作法：${caseData.approach}
//     問題與挑戰：${caseData.problemAndChanllge}
//     成果：${caseData.achievement}

//     [JSON]:`;

//   let toGPTData = {
//     ...config.chatgptAPI.data,
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: toGPTPrompt },
//     ],
//   };

//   toGPTData.temperature = 1.3;
//   // toGPTData.model = "gpt-4-0613"

//   console.log('[GPT]To:', toGPTData);

//   await axios
//     .post(config.chatgptAPI.apiUrl, toGPTData, {
//       headers: config.chatgptAPI.header,
//     })
//     .then(async (response) => {
//       let responseMessage = response.data.choices[0].message.content;
//       console.log('[GPT]Response', responseMessage);
//       let newChatGPTData = new ChatGPT({
//         workshop: generateData.workshop,
//         issue: generateData.issue,
//         user: generateData.user,
//         prompt: toGPTData.messages[1].content,
//         response: responseMessage,
//         purpose: 'for CaseData Keyword',
//         addDatetime: new Date(),
//       });
//       newChatGPTData.save((err, doc) => {
//         if (err) {
//           res.status(500).send(err);
//           throw '[Database]Error' + err;
//         }
//         res.status(200).send(responseMessage);
//       });
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//       throw '[ChatGPT]Error' + error;
//     });
// };
