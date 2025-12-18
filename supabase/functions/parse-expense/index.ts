import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const ONSPACE_AI_BASE_URL = Deno.env.get('ONSPACE_AI_BASE_URL') ?? '';
const ONSPACE_AI_API_KEY = Deno.env.get('ONSPACE_AI_API_KEY') ?? '';

interface ParseExpenseRequest {
  text?: string;
  imageBase64?: string;
  inputMethod: 'chat' | 'voice' | 'photo';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { text, imageBase64, inputMethod }: ParseExpenseRequest = await req.json();

    let messages = [];
    
    if (inputMethod === 'photo' && imageBase64) {
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract expense information from this receipt. Return a JSON object with: amount (number), description (string), category (one of: Food, Transport, Shopping, Entertainment, Bills, Health, Other), date (ISO string, use today if not visible).'
            },
            {
              type: 'image_url',
              image_url: { url: imageBase64 }
            }
          ]
        }
      ];
    } else {
      const prompt = inputMethod === 'voice' 
        ? `Parse this voice transcription into an expense: "${text}". Return JSON with: amount (number), description (string), category (one of: Food, Transport, Shopping, Entertainment, Bills, Health, Other), date (ISO string, default to today).`
        : `Parse this expense entry: "${text}". Return JSON with: amount (number), description (string), category (one of: Food, Transport, Shopping, Entertainment, Bills, Health, Other), date (ISO string, default to today).`;
      
      messages = [{ role: 'user', content: prompt }];
    }

    console.log('Calling OnSpace AI with model: google/gemini-3-flash-preview');

    const response = await fetch(`${ONSPACE_AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ONSPACE_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OnSpace AI error:', errorText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const parsedExpense = JSON.parse(aiData.choices[0].message.content);

    console.log('Parsed expense:', parsedExpense);

    return new Response(
      JSON.stringify(parsedExpense),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-expense:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
