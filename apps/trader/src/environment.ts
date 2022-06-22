import { cleanEnv, str } from 'envalid'

export const environment = cleanEnv(process.env, {
  NODE_ENV: str(),
  COINCHECK_ACCESS_KEY: str(),
  COINCHECK_SECRET_KEY: str(),
})
