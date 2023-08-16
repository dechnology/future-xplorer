import { Configuration, OpenAIApi } from 'openai';

const { openaiApiKey } = useRuntimeConfig();

export default defineNitroPlugin((nitroApp) => {
  try {
    nitroApp.openai = new OpenAIApi(
      new Configuration({ apiKey: openaiApiKey })
    );
    console.log('openai loaded');
  } catch (e) {
    console.error(e);
  }
});
