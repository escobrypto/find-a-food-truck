// api/scan-menu.js — Vercel Serverless Function
// Proxies the menu photo to Anthropic's API to avoid CORS issues

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { base64, mediaType } = req.body;

  if (!base64 || !mediaType) {
    return res.status(400).json({ error: 'Missing base64 or mediaType' });
  }

  // Limit payload size check (base64 images can be large)
  if (base64.length > 10_000_000) {
    return res.status(413).json({ error: 'Image too large. Try a smaller photo.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: missing API key' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'You extract menu items from food truck menu photos. Return ONLY valid JSON — no markdown, no backticks, no explanation. Return an array of objects with keys: name (string), price (number), desc (string, brief description or empty string). If you cannot read items clearly, return what you can. Example: [{"name":"Brisket Tacos","price":14,"desc":"Smoked brisket with slaw"}]',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: base64 },
              },
              {
                type: 'text',
                text: 'Extract all menu items with names, prices, and descriptions from this menu photo. Return ONLY a JSON array.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: 'AI service error. Try again.' });
    }

    const data = await response.json();
    const text = data.content?.map((c) => c.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();

    let items;
    try {
      items = JSON.parse(clean);
    } catch {
      return res.status(200).json({ items: [], error: 'Could not parse menu items from this image.' });
    }

    if (Array.isArray(items) && items.length > 0) {
      return res.status(200).json({ items });
    } else {
      return res.status(200).json({ items: [], error: 'No menu items found. Try a clearer photo.' });
    }
  } catch (err) {
    console.error('Scan error:', err);
    return res.status(500).json({ error: 'Failed to process menu. Try again.' });
  }
}
