const { Configuration, OpenAIApi } = require("openai");
const logger = require("./logger.js");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const makeRequest = async (prompt) => {
  let initial_prompt = [
    { role: "system", content: "I am a helpful assistant." },
    { role: "user", content: "Who are you" },
  ];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: initial_prompt,
      temperature: 0,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["You:"],
    });

    let answer = response.data.choices[0].message.content;
    logger.info(answer);
    // initial_prompt.push(answer);

    return answer;
  } catch (error) {
    logger.error(error);
  }
};

module.exports = makeRequest;
