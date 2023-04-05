# DJ Kirdun GPT Bot

- This is a simple bot created using [@discord.js](https://old.discordjs.dev/#/)
- This bot connected to open ai for chat completion aka GPT. Model used is GPT-3.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- `TOKEN` - Discord developer token
- `CLIENT_ID` - Discord application client id
- `OPENAI_AI_KEY` - This is your key to access open ai api

To obtain the `TOKEN` and `CLIENT_ID` simply follow this [guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

`OPENAI_AI_KEY` can be obtain on your OPEN AI profile manager

## Run Locally

Clone the project

```bash
  git clone https://github.com/ismi-abbas/dj-kirdun-gpt.git dj-kirdun-gpt
```

Go to the project directory

```bash
  cd dk-kirdun-gpt
```

Install dependencies - I use pnpm as the package manager

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Authors

- [@ismi-abbas](https://www.github.com/ismi-abbas)
