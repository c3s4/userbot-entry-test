import { WordsAnalyzer } from './words-analyzer';
import fs from 'fs';

describe('Words analyzer', () => {
  const analyzer = new WordsAnalyzer();
  it('should exists', () => {
    expect(analyzer).toBeDefined();
  });

  it('analyze function should exist', () => {
    expect(analyzer.analyze).toBeDefined();
  });

  it('should return expected word counts and words histogram', async () => {
    const data = 'First words Simple test, very simple';
    const expectedWordsCount = 6;
    const expectedWordsHistogram = {
      words: 1,
      simple: 2,
      very: 1,
      first: 1,
      test: 1,
    };

    const result = await analyzer.analyze(data);
    expect(result.wordsCount).toBe(expectedWordsCount);
    expect(result.wordsHistogram).toMatchObject(expectedWordsHistogram);
  });

  it('should consider also numbers and symbols as splitting points', async () => {
    const data = 'First w0rds s1mple t3St, very s!mpLe, 0rds';
    const expectedWordsCount = 11;
    const expectedWordsHistogram = {
      w: 1,
      rds: 2,
      s: 2,
      mple: 2,
      t: 1,
      st: 1,
      very: 1,
      first: 1,
    };

    const result = await analyzer.analyze(data);
    expect(result.wordsCount).toBe(expectedWordsCount);
    expect(result.wordsHistogram).toMatchObject(expectedWordsHistogram);
  });

  it('should return the right count and histogram from text file', async () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/lorem.txt').toString();
    console.log(analyzer.analyze(data));
    const expectedHistogram = {
      lorem: 1,
      ipsum: 1,
      dolor: 2,
      sit: 1,
      amet: 1,
      consectetur: 1,
      adipiscing: 1,
      elit: 1,
      sed: 1,
      do: 1,
      eiusmod: 1,
      tempor: 1,
      incididunt: 1,
      ut: 3,
      labore: 1,
      et: 1,
      dolore: 2,
      magna: 1,
      aliqua: 1,
      enim: 1,
      ad: 1,
      minim: 1,
      veniam: 1,
      quis: 1,
      nostrud: 1,
      exercitation: 1,
      ullamco: 1,
      laboris: 1,
      nisi: 1,
      aliquip: 1,
      ex: 1,
      ea: 1,
      commodo: 1,
      consequat: 1,
      duis: 1,
      aute: 1,
      irure: 1,
      in: 3,
      reprehenderit: 1,
      voluptate: 1,
      velit: 1,
      esse: 1,
      cillum: 1,
      eu: 1,
      fugiat: 1,
      nulla: 1,
      pariatur: 1,
      excepteur: 1,
      sint: 1,
      occaecat: 1,
      cupidatat: 1,
      non: 1,
      proident: 1,
      sunt: 1,
      culpa: 1,
      qui: 1,
      officia: 1,
      deserunt: 1,
      mollit: 1,
      anim: 1,
      id: 1,
      est: 1,
      laborum: 1,
    };

    const result = await analyzer.analyze(data);

    expect(result.wordsCount).toBe(69);
    expect(result.wordsHistogram).toMatchObject(expectedHistogram);
  });

  it('should return 0 count for data without words', async () => {
    const data = '234 1!@@ 345343 434 3334 0-=+';
    const result = await analyzer.analyze(data);

    expect(result.wordsCount).toBe(0);
    expect(result.wordsHistogram).toMatchObject({});
  });
});
