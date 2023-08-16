export default defineEventHandler(async (event): Promise<{ image: string }> => {
  const openai = useNitroApp().openai;
  const { prompt }: { prompt: string } = await readBody(event);

  const response = await openai.createImage({
    prompt,
  });

  if (!response.data.data[0].url) {
    throw new Error(`OpenAI error: ${response}`);
  }

  return { image: response.data.data[0].url };
});
