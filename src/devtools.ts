import { existsSync } from 'node:fs'
import type { Nuxt } from 'nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import { addCustomTab, extendServerRpc } from '@nuxt/devtools-kit'
//import { execaCommand } from 'execa'

const DEVTOOLS_UI_ROUTE = '/__vue-mess-detector'
const DEVTOOLS_UI_LOCAL_PORT = 3300

export function setupDevToolsUI(nuxt: Nuxt, resolver: Resolver) {
  const clientPath = resolver.resolve('./client')
  const isProductionBuild = existsSync(clientPath)

  // Serve production-built client (used when package is published)
  if (isProductionBuild) {
    nuxt.hook('vite:serverCreated', async (server) => {
      const sirv = await import('sirv').then(r => r.default || r)
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true }),
      )
    })
  }
  // In local development, start a separate Nuxt Server and proxy to serve the client
  else {
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: 'http://localhost:' + DEVTOOLS_UI_LOCAL_PORT + DEVTOOLS_UI_ROUTE,
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(DEVTOOLS_UI_ROUTE, ''),
      }
    })
  }

  addCustomTab({
    name: 'vue-mess-detector',
    title: 'Vue Mess Detector',
    icon: 'tabler:analyze',
    view: {
      type: 'iframe',
      src: DEVTOOLS_UI_ROUTE,
    },
  })

  // extendServerRpc('vue-mess-detector', {
  //   analyze: async () => {
  //     return 'gauranga'
  // try {
  //   const { stdout } = await execaCommand('npx vue-mess-detector analyze')
  //   return stdout
  // } catch (error) {
  //   console.error('Error running vue-mess-detector:', error)
  //   return 'Error running vue-mess-detector'
  // }
  //   }
  // })
  try {
    const rpc = extendServerRpc('vue-mess-detector', {
      analyze: async () => {
        return 'hello'
      }
    })
    console.log('RPC extension successful:', rpc)
  } catch (error) {
    console.error('Failed to extend server RPC:', error)
  }
}
