declare module '@nuxt/schema' {
  interface RuntimeConfig {
    dbName: string
    dbUser: string
    dbPassword: string
    dbHost: string
    dbPort: number
  }
}

const config: RuntimeConfig

export default config
