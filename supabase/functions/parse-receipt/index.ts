// Supabase Edge Function: parse-receipt
// Uses Google Gemini 3.6 Flash with multimodal vision to parse Indian supermarket, restaurant, and tax receipts.

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
    const { imageBase64, mimeType = 'image/jpeg' } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'imageBase64 payload is required' }),
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

    const prompt = `Analyze this Indian purchase receipt or tax invoice.
Extract the merchant name, total amount in INR, date, tax (GST) amount, line items, and assign the best spending category (Food & Dining, Groceries, Shopping, Healthcare, Entertainment, Utilities, Travel, Other).

Respond ONLY with valid JSON matching this schema:
{
  "merchant": "string",
  "amount": number,
  "date": "YYYY-MM-DD",
  "category": "string",
  "taxAmount": number,
  "confidenceScore": number,
  "lineItems": [
    { "name": "string", "quantity": number, "price": number }
  ],
  "rawText": "string"
}`;

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
          ],
        },
      ],
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
      JSON.stringify({ error: error.message || 'Failed to parse receipt' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
