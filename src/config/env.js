require('dotenv').config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(
      `Missing required env "${name}". Copy .env.example to .env and set a real value.`,
    );
  }
  return value.trim();
}

function optionalEnv(name, fallback) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    return fallback;
  }
  return value.trim();
}

const env = {
  demoqa: {
    baseUrl: optionalEnv('DEMOQA_BASE_URL', 'https://demoqa.com'),
    username: () => requireEnv('DEMOQA_USERNAME'),
    password: () => requireEnv('DEMOQA_PASSWORD'),
  },
  reqres: {
    baseUrl: optionalEnv('REQRES_BASE_URL', 'https://reqres.in'),
    apiKey: () => requireEnv('REQRES_API_KEY'),
  },
  isCi: Boolean(process.env.CI),
};

module.exports = { env, requireEnv, optionalEnv };
