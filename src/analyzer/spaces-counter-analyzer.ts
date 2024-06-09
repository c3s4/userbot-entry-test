import { AnalyzerComponent } from './analyzer.interface';

interface Results {
  spacesCount: number;
}

export class SpacesCounterAnalyzer implements AnalyzerComponent<Results> {
  analyze(data: string): Results {
    return {
      spacesCount: data.match(/ /g)?.length || 0,
    };
  }
}
