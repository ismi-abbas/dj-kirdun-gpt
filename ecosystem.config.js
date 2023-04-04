module.exports = {
  apps: [
    {
      name: "gpt",
      script: "./index.js",
      watch: true,
      env_dev: {
        NODE_ENV: "development",
      },
      env_prod: {
        NODE_ENV: "production",
      },
    },
  ],
};
