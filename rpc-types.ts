export interface AnalysisResult {
  output: { info: string }[]
  reportOutput: Record<string, Array<{ id: string, description: string, message: string }>>
  codeHealthOutput: { info: string }[]
}

export interface ServerFunctions {
  getResults: () => Promise<AnalysisResult>
}

export interface ClientFunctions {
  _doNothing: () => void
}
