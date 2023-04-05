const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  {
    name: 'server',
    description: 'Give server name!'
  },
  {
    name: 'test',
    description: 'Testing the server!'
  },
  {
    name: 'ask',
    description: 'Ask the GPT-4!',
    options: [
      {
        name: 'input',
        description: 'Input to the GPT-4',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'clear',
    description: 'Clear the chat!'
  },
  {
    name: 'github',
    description: 'Github utility commands',
    options: [
      {
        name: 'username',
        description: 'Get GitHub user info',
        type: 3,
        required: true
      },
      {
        name: 'repo',
        description: 'Get GitHub repo info',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'select',
    description: 'Select a language for GPT-4'
  }
]

export default commands
