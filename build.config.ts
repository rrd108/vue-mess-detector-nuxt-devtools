import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'vue-mess-detector',
    'yargs',
    '@vue/compiler-sfc',
    'cliui',
    'escalade/sync',
    'yargs-parser',
    'y18n',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    output: {
      exports: 'named',
    },
    plugins: [
      {
        name: 'node-globals',
        resolveId: (source: string) => source === 'node:path' ? source : null,
        load: (id: string) => {
          if (id === 'node:path') {
            return `
                            import path from 'path'
                            export default path
                            export const __dirname = path.dirname(new URL(import.meta.url).pathname)
                            export const __filename = new URL(import.meta.url).pathname
                        `
          }
        },
      },
    ],
  },
  declaration: true,
  failOnWarn: false,
})
