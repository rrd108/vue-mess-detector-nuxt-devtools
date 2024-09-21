import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import { analyze, FLAT_RULES } from 'vue-mess-detector'
import type { ClientFunctions, ServerFunctions } from '../rpc-types'

export interface ModuleOptions {
  devtools: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vue-mess-detector',
    configKey: 'vueMessDetector',
  },

  defaults: {
    devtools: true,
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/plugin'))

    if (options.devtools) {
      setupDevToolsUI(nuxt, resolver)
    }

    onDevToolsInitialized(async () => {
      const rpc = extendServerRpc<ClientFunctions, ServerFunctions>('vueMessDetector', {
        getResults: async () => {
          const results = await analyze({ dir: './src/', apply: FLAT_RULES })
          return results
        }
      })
    })
  }
})

