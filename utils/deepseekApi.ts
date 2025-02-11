import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: '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', // Replace with your actual DeepSeek API key
});

export const generateLoveLetter = async (recipientName: string, prompt: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Write a love letter to ${recipientName}. ${prompt}` },
      ],
      model: "deepseek-chat",
    });

    if (completion.choices[0].message.content) {
      return completion.choices[0].message.content; // Return the generated letter
    } else {
      throw new Error('No content was generated for the love letter.');
    }
  } catch (error) {
    console.error('Error generating love letter:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
}; 