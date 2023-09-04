export default defineEventHandler(async (event): Promise<{ image: string }> => {
  const { prompt }: { prompt: string } = await readBody(event);

  console.log(prompt);

  const response = await openai.createImage({
    prompt,
  });

  if (!response.data.data[0].url) {
    throw new Error(`OpenAI error: ${response}`);
  }

  return { image: response.data.data[0].url };
});
