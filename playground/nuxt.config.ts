import { resolve } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { startSubprocess } from '@nuxt/devtools-kit'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  modules: [
    /**
     * Vue Mess Detector
     */
    '../src/module',
    /**
     * Start a sub Nuxt Server for developing the client
     *
     * The terminal output can be found in the Terminals tab of the devtools.
     */
    defineNuxtModule({
      setup(_, nuxt) {
        if (!nuxt.options.dev) {
          return
        }

        const _process = startSubprocess(
          {
            command: 'npx',
            args: ['nuxi', 'dev', '--port', '3300'],
            cwd: resolve(__dirname, '../client'),
          },
          {
            id: 'vue-mess-detector:client',
            name: 'Vue Mess Detector Client Dev',
          },
        )
      },
    }),
  ],

  vueMessDetector: {},

  compatibilityDate: '2024-08-21',
})
