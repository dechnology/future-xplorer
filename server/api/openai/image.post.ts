export default defineEventHandler(async (event): Promise<{ image: string }> => {
  const { prompt }: { prompt: string } = await readBody(event);

  console.log(prompt);

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
  });

  if (!response.data[0].url) {
    throw new Error(`OpenAI error: ${response}`);
  }

  return { image: response.data[0].url };
});
