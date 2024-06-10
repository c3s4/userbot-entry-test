import { AnalyzerComponent } from './analyzer.interface';

interface Results {
  wordsCount: number;
  wordsHistogram: Record<string, number>;
}

export class WordsAnalyzer implements AnalyzerComponent<Results> {
  async analyze(data: string): Promise<Results> {
    const wordTokens = data.match(/[a-zA-Z]+/g);
    const wordsHistogram: Record<string, number> = {};

    wordTokens?.forEach((t) => {
      const lowerCasedToken = t.toLowerCase();
      wordsHistogram[lowerCasedToken] = wordsHistogram[lowerCasedToken] ? wordsHistogram[lowerCasedToken] + 1 : 1;
    });

    return {
      wordsCount: wordTokens?.length || 0,
      wordsHistogram,
    };
  }
}
