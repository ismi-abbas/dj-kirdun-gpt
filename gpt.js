const { Configuration, OpenAIApi } = require("openai");
const logger = require("./logger.js");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const makeRequest = async (prompt) => {
  let initial_prompt = [
    { role: "system", content: "I am a helpful assistant." },
  ];

  if (prompt) {
    initial_prompt.push({ role: "user", content: prompt });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: initial_prompt,
      temperature: 0.5,
      max_tokens: 4000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["You:"],
    });

    const answer = response.data.choices[0].message.content;
    initial_prompt.push({ role: "system", content: answer });

    return answer;
  } catch (error) {
    logger.error(error);
  }
};

module.exports = makeRequest;
