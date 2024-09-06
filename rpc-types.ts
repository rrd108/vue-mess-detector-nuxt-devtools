import { Readable } from 'stream'

export interface ServerFunctions {
    executeLsCommand: () => Promise<string | Readable>
}

export interface ClientFunctions {
    displayLsResults: (results: string | Readable) => void;
}
