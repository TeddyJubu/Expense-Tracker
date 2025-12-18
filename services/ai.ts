import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

export interface ParsedExpense {
  amount: number;
  description: string;
  category: string;
  date: string;
}

export const aiService = {
  async parseExpense(
    text: string | undefined,
    imageBase64: string | undefined,
    inputMethod: 'chat' | 'voice' | 'photo',
    audioBase64?: string
  ): Promise<{ data: ParsedExpense | null; error: string | null }> {
    try {
      if (!apiKey) {
        return { data: null, error: 'Gemini API key not found' };
      }

      const prompt = `
        Parse the following expense information into a JSON object with these fields:
        - "amount" (number): The total cost.
        - "description" (string): A short summary of what was purchased.
        - "category" (string): One of these categories: Food, Transport, Shopping, Entertainment, Bills, Health, Other.
        - "date" (string): The date of the expense in ISO-8601 format (YYYY-MM-DD). If no date is provided, use today's date (${new Date().toISOString().split('T')[0]}).

        Return ONLY the raw JSON object. Do not include markdown code blocks or additional text.
      `;

      let result;
      if (audioBase64) {
        // Handle voice input
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: audioBase64,
              mimeType: 'audio/mp4', // Standard for m4a/aac recordings
            },
          },
        ]);
      } else if (imageBase64) {
        // Remove data URL prefix if present for Gemini SDK
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
        ]);
      } else if (text) {
        result = await model.generateContent([prompt, text]);
      } else {
        return { data: null, error: 'No input provided' };
      }

      const response = result.response;
      let textResponse = response.text();

      // Clean up markdown code blocks if Gemini returns them
      textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedData = JSON.parse(textResponse);

      return {
        data: {
          amount: Number(parsedData.amount) || 0,
          description: parsedData.description || 'Expense',
          category: parsedData.category || 'Other',
          date: parsedData.date || new Date().toISOString(),
        },
        error: null,
      };

    } catch (error: any) {
      console.error('Gemini parsing error:', error);
      return { data: null, error: error.message || 'Failed to parse expense with Gemini' };
    }
  },
};
