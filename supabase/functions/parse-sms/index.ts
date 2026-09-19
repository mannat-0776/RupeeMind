// Supabase Edge Function: parse-sms
// Uses Google Gemini 3.6 Flash to parse Indian Bank Transactional SMS alerts (HDFC, ICICI, SBI, Axis, UPI, Kotak, etc.)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenAI } from 'npm:@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { smsText } = await req.json();

    if (!smsText) {
      return new Response(
        JSON.stringify({ error: 'smsText is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured on Supabase Secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze this Indian Bank transactional SMS alert.
Extract transaction type (debit or credit), exact amount in INR, merchant/receiver name, bank name (e.g. HDFC, ICICI, SBI, Axis, UPI, Kotak), card/account last 4 digits (if present), transaction date, remaining account balance (if present), and assign an accurate spending category.

Respond ONLY with valid JSON matching this schema:
{
  "type": "debit" | "credit",
  "amount": number,
  "merchant": "string",
  "bankName": "string",
  "accountLast4": "string",
  "date": "YYYY-MM-DD",
  "availableBalance": number | null,
  "category": "string",
  "confidenceScore": number,
  "isRecurring": boolean
}

SMS to analyze:
"${smsText}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    const parsedData = JSON.parse(resultText);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to parse SMS' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
