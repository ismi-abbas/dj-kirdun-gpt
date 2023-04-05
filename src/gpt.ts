import { Configuration, OpenAIApi } from 'openai'
import logger from './logger.js'
import * as dotenv from 'dotenv'
dotenv.config()

const configuration = new Configuration({
  organization: 'org-3GyqWgDcWi69pMO9ouDIrM0W',
  apiKey: process.env.OPENAI_AI_KEY
})

const openai = new OpenAIApi(configuration)

const initial_prompt = [
  { role: 'system', content: "You're a helpful assistant" }
]

export const makeRequest = async (prompt: string, type: string) => {
  if (prompt) {
    initial_prompt.push({ role: 'user', content: prompt })
  }

  if (type === 'quote') {
    initial_prompt[0].content = `You're a very good novelist`
  }
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: initial_prompt as [],
      temperature: 0.5,
      max_tokens: 4096,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ['You:']
    })

    const answer = response.data.choices[0].message.content
    initial_prompt.push({ role: 'system', content: answer })
    console.log(initial_prompt)

    return answer
  } catch (error) {
    logger.error(error)
  }
}
