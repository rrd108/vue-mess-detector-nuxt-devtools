import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import { analyze } from 'vue-mess-detector'
import type { AnalysisResult, ServerFunctions } from '../rpc-types'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable Nuxt Devtools integration
   *
   * @default true
   */
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
      const results = await analyze({ dir: './src', apply: [], ignore: [], groupBy: 'rule', level: 'all', sortBy: 'asc' })
      console.log({ results })

      // add a new remote procedure call method to the Nuxt Devtools server
      const rpc = extendServerRpc<ServerFunctions>('vueMessDetector', {
        getResults: async (): Promise<AnalysisResult> => {
          return {
            output: results.output,
            reportOutput: results.reportOutput,
            codeHealthOutput: results.codeHealthOutput
          }
        },
      })

      //await rpc.broadcast.showNotification('Hello from My Module!')
    })
  }
})

