import { AnalyzerComponent } from './analyzer.interface';

interface Results {
  lettersCount: number;
}

export class LettersCounterAnalyzer implements AnalyzerComponent<Results> {
  async analyze(data: string): Promise<Results> {
    return { lettersCount: data.match(/[a-zA-Z]/g)?.length || 0 };
  }
}
