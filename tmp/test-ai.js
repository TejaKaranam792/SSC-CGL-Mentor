const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

async function testAI() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
  const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

  if (!apiKey) {
    console.error('No API key found in .env.local');
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.0-flash';

  try {
    console.log(`Testing model: ${model}...`);
    const response = await ai.models.generateContent({
      model,
      contents: 'Say "System OK" if you receive this.',
    });
    console.log('Response:', response.text);
  } catch (err) {
    console.error('API Error:', err);
    if (err.message) console.error('Message:', err.message);
  }
}

testAI();
