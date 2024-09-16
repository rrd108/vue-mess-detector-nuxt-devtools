import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import { analyze, FLAT_RULESETS_RULES } from 'vue-mess-detector'
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
    console.log('module:setup')
    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/plugin'))

    if (options.devtools) {
      setupDevToolsUI(nuxt, resolver)
    }

    onDevToolsInitialized(async () => {
      console.log('module:onDevToolsInitialized')

      const rpc = extendServerRpc<ClientFunctions, ServerFunctions>('vueMessDetector', {
        getResults: async () => {
          const results = await analyze({ dir: './src/', apply: FLAT_RULESETS_RULES, ignore: [], groupBy: 'rule', level: 'all', sortBy: 'asc' })
          console.log('getResults() called on server')
          console.log({ results })
          return results
        }
      })
    })
  }
})

