// All implementation need to read from a stream

export interface AnalyzerComponent<AnalysisResult = {}> {
  analyze: (data: string) => Promise<AnalysisResult>;
}
