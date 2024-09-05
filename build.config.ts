import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    externals: [
        'execa',
        'cross-spawn',
        'strip-final-newline',
        'npm-run-path',
        'onetime',
        'is-stream',
        'signal-exit',
        'human-signals',
        'get-stream',
        'merge-stream',
        'mimic-fn',
        'path-key',
        'which',
        'shebang-command',
        'isexe',
        'shebang-regex'
    ],
})