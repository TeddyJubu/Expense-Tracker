import { getSupabaseClient } from '@/template';
import { FunctionsHttpError } from '@supabase/supabase-js';

const supabase = getSupabaseClient();

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
    inputMethod: 'chat' | 'voice' | 'photo'
  ): Promise<{ data: ParsedExpense | null; error: string | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('parse-expense', {
        body: { text, imageBase64, inputMethod },
      });

      if (error) {
        let errorMessage = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const textContent = await error.context?.text();
            errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
          } catch {
            errorMessage = `${error.message || 'Failed to parse expense'}`;
          }
        }
        return { data: null, error: errorMessage };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};
