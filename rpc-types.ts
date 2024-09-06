export interface ServerFunctions {
    analyze: () => Promise<string>
}

export interface ClientFunctions {
    showOutput: (output: string) => void
}
