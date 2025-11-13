import zennv from "zennv";
import dotenv from "dotenv";
import z from "zod";

// Load appropriate .env file based on NODE_ENV
// zennv uses dotenv under the hood, so we can load it here
// to ensure the environment variables are available before zennv processes them.
// https://github.com/tomanagle/zennv

// Only load dotenv if it hasn't been loaded already
if (!process.env.DOTENV_LOADED) {
  if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test", override: false });
  } else {
    dotenv.config({ override: false });
  }
  process.env.DOTENV_LOADED = "true";
}

export const env = zennv({
  dotenv: false, // We've already loaded dotenv
  schema: z.object({
    PORT: z.string().default("3000"),
    HOST: z.string().default("localhost"),
    NODE_ENV: z.string().default("development"),
    CORS: z.string().default("http://localhost:3000"),

    MONGODB_URI: z.string().default("mongodb://localhost:27017"),

    SALT_ROUND: z.number().default(12),
    JWT_SECRET_KEY: z.string(),

    SOLANA_RPC_URL: z.string(),
    SOLANA_DEVNET_API: z.string(),
    ENCRYPTION_KEY: z.string(),
    IV: z.string(),
    GOOGLE_CLOUD_KEY_RING: z.string(),
    GOOGLE_CLOUD_KEY: z.string(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string(),
    PROJECT_ID: z.string(),
    NETWORK_ENVIRONMENT: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    ACCESS_TOKEN_PRIVATE_KEY: z.string(),
    ETHEREUM_RPC_URL: z.string(),
    BSC_RPC_URL: z.string(),
    AVALANCHE_RPC_URL: z.string(),
    COINGECKO_URL: z.string(),

  }),
});
