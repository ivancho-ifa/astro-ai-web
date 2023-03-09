import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  createBirthChartChatGpt(req, res);
}

function createBirthChartChatGpt(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const birthInfo = req.body.birthInfo || {};
  if (!birthInfo) {
    res.status(400).json({
      error: {
        message: "Please enter valid birth info",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatMessages(birthInfo),
      temperature: 0,
    });
    const result = completion.data.choices[0].message.content
    console.info(`Birth chart is ${result}`)
    res.status(200).json({ result: JSON.parse(result) });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function chatMessages(birthInfo) {
  return [
    { 'role': 'system', 'content': 'You are an experienced astrologist. Use online astrology software if available. Use the Placidus method for birth charts. Return the list of planetary positions and the houses for birth charts.' },
    { 'role': 'system', 'content': 'Skip courtesy and introduction sentences. Answer questions straight. One user will ask the same question many times. It is OK to always give the same answer for the same data.' },
    { 'role': 'user', 'content': `Create a birth chart for me. I am born on 30 September at 15:20 in Kazanlak, Bulgaria` },
    { 'role': 'assistant', 'content': '{"Sun":{"sign":"Libra","house":8},"Moon":{"sign":"Taurus","house":3},"Mercury":{"sign":"Virgo","house":7},"Venus":{"sign":"Leo","house":7},"Mars":{"sign":"Leo","house":7},"Jupiter":{"sign":"Capricorn","house":12},"Saturn":{"sign":"Aries","house":2},"Uranus":{"sign":"Aquarius","house":12},"Neptune":{"sign":"Capricorn","house":12},"Pluto":{"sign":"Sagittarius","house":10},"Chiron":{"sign":"Libra","house":8},"Lilith":{"sign":"Leo","house":7},"True Node":{"sign":"Libra","house":8},"Part of Fortune":{"sign":"Virgo","house":7},"Vertex":{"sign":"Virgo","house":7},"Ascendant":{"sign":"Aquarius"},"Midheaven":{"sign":"Taurus"}}' },
    { 'role': 'user', 'content': `Create a birth chart for me. I am born on ${birthInfo.birthDate} at ${birthInfo.birthTime} in ${birthInfo.birthPlace}` },
  ]
}

