const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "server",
    description: "Give server name!",
  },
  {
    name: "test",
    description: "Testing the server!",
  },
  {
    name: "ask",
    description: "Ask the GPT-4!",
    options: [
      {
        name: "input",
        description: "Input to the GPT-4",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "clear",
    description: "Clear the chat!",
  },
];

module.exports = commands;