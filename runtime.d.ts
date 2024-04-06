import { useRuntimeConfig } from '#imports'

export interface RuntimeConfig {
  dbName: string
  dbUser: string
  dbPassword: string
  dbHost: string
  dbPort: number
}

export const config = useRuntimeConfig() as RuntimeConfig
