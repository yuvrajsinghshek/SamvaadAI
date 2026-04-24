import axios from 'axios';

const API_URL = "https://router.huggingface.co/v1/chat/completions";
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

export const sendMessage = async (messages) => {
  try {
    const response = await axios.post(API_URL, {
      model: "moonshotai/Kimi-K2.5",
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: 0.75,
      max_tokens: 1400
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const analyzeImage = async (prompt, imageData) => {
  try {
    const response = await axios.post(API_URL, {
      model: "moonshotai/Kimi-K2.5",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageData}` } }
        ]
      }],
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const base64 = btoa(
      new Uint8Array(response.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
};
