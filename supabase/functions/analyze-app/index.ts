const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

const PROMPT = (url: string) => `Analyze this app store URL: ${url}
Reply with ONLY this JSON, no extra text:
{"appName":"","developer":"","category":"","rating":"4.0","price":"Free","overview":"1-2 sentences","targetAudience":"","monetization":"","complaints":["","",""],"screenCount":10,"screenFlow":["Home","Detail"],"mustHaveFeatures":[""],"niceToHaveFeatures":[""],"techStack":[""],"difficulty":"Easy","improvements":["","",""],"buildSteps":[{"step":"Auth","time":"1hr"},{"step":"Core","time":"2hrs"},{"step":"Polish","time":"1hr"}]}
Rules: difficulty must be exactly one of: Easy, Medium, Hard. screenCount must be an integer.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'url is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const DEEPSEEK_KEY = Deno.env.get('DEEPSEEK_KEY') ?? '';
    if (!DEEPSEEK_KEY) {
      return new Response(JSON.stringify({ error: 'DEEPSEEK_KEY secret not set' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: PROMPT(url) }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: `DeepSeek ${res.status}: ${err}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const raw: string = data.choices[0].message.content;
    const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    return new Response(json, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('analyze-app error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
