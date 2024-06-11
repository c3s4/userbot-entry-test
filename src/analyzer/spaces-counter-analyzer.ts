import { AnalyzerComponent } from './analyzer.interface';

interface Results {
  spacesCount: number;
}

export class SpacesCounterAnalyzer implements AnalyzerComponent<Results> {
  async analyze(data: string): Promise<Results> {
    return {
      spacesCount: data.match(/ /g)?.length || 0,
    };
  }
}
