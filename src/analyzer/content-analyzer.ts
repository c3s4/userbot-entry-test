import fs from 'fs';
import { AnalyzerComponent } from './analyzer.interface';
import { LettersCounterAnalyzer } from './letters-counter-analyzer';
import { SpacesCounterAnalyzer } from './spaces-counter-analyzer';
import { WordsAnalyzer } from './words-analyzer';

interface AnalysisResults {
  spacesCount: number;
  lettersCount: number;
  wordsCount: number;
  wordsHistogram: Record<string, number>;
}

export class ContentAnalyzer {
  private analysisComponents = {
    lettersCounterAnalyzer: new LettersCounterAnalyzer(),
    spacesCounterAnalyzer: new SpacesCounterAnalyzer(),
    wordAnalyzer: new WordsAnalyzer(),
  };

  async analyze(data: string): Promise<AnalysisResults> {
    const res = await Promise.all([
      this.analysisComponents.spacesCounterAnalyzer.analyze(data),
      this.analysisComponents.lettersCounterAnalyzer.analyze(data),
      this.analysisComponents.wordAnalyzer.analyze(data),
    ]);

    return {
      spacesCount: res[0].spacesCount,
      lettersCount: res[1].lettersCount,
      wordsCount: res[2].wordsCount,
      wordsHistogram: res[2].wordsHistogram,
    };
  }
}
