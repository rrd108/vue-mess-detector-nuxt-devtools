import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import type { ClientFunctions, ServerFunctions } from '../rpc-types'
import { exec } from 'child_process'

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
      const rpc = extendServerRpc<ClientFunctions, ServerFunctions>('vue-mess-detector', {
        // register server RPC function
        executeLsCommand: async () => {
          const { stdout } = exec('ls')
          return stdout || 'ls err'
        },
      });

      // call client RPC function to display results
      const results = await rpc.functions.executeLsCommand()
      await rpc.broadcast.displayLsResults(results);
    });
  }
})
