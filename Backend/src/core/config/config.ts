import { AppConfig, createConfig } from "./createConfig"
import { getEnv } from "./env"

let _config: AppConfig | null = null

export function getConfig(): AppConfig {
  if (!_config) {
    const env = getEnv()
    _config = createConfig(env)
  }
  return _config
}

export function _resetConfig() {
  _config = null
}