import { ContentAnalyzer } from './content-analyzer';
import { LettersCounterAnalyzer } from './letters-counter-analyzer';
import { SpacesCounterAnalyzer } from './spaces-counter-analyzer';
import { WordsAnalyzer } from './words-analyzer';
import fs from 'fs';

interface MockAnalyzers {
  lettersAnalyzer: jest.SpyInstance;
  spacesAnalyzer: jest.SpyInstance;
  wordsAnalyzer: jest.SpyInstance;
}

const mockAnalyzers = () => ({
  lettersAnalyzer: jest.spyOn(LettersCounterAnalyzer.prototype, 'analyze').mockImplementation(async (data: string) => {
    return {
      lettersCount: 23,
    };
  }),
  spacesAnalyzer: jest.spyOn(SpacesCounterAnalyzer.prototype, 'analyze').mockImplementation(async () => {
    return {
      spacesCount: 13,
    };
  }),
  wordsAnalyzer: jest.spyOn(WordsAnalyzer.prototype, 'analyze').mockImplementation(async () => {
    return {
      wordsCount: 16,
      wordsHistogram: {
        foo: 2,
        bar: 34,
      },
    };
  }),
});

describe('Content analyzer', () => {
  let contentAnalyzer = new ContentAnalyzer();
  let spy: MockAnalyzers;

  it('should analyze method exists', () => {
    expect(contentAnalyzer.analyze);
  });

  it('should return an object with the right fields', async () => {
    const data = '';
    const result = await contentAnalyzer.analyze(data);

    expect(result).toHaveProperty('spacesCount');
    expect(result).toHaveProperty('lettersCount');
    expect(result).toHaveProperty('wordsCount');
    expect(result).toHaveProperty('wordsHistogram');
  });

  it('should return an object with the expected values', async () => {
    const data = 'any data';
    spy = mockAnalyzers();

    const result = await contentAnalyzer.analyze(data);

    expect(spy.lettersAnalyzer).toHaveBeenCalledTimes(1);
    expect(spy.spacesAnalyzer).toHaveBeenCalledTimes(1);
    expect(spy.wordsAnalyzer).toHaveBeenCalledTimes(1);

    expect(spy.lettersAnalyzer).toHaveBeenCalledWith(data);
    expect(spy.spacesAnalyzer).toHaveBeenCalledWith(data);
    expect(spy.wordsAnalyzer).toHaveBeenCalledWith(data);

    expect(result.lettersCount).toBe(23);
    expect(result.spacesCount).toBe(13);
    expect(result.wordsCount).toBe(16);
    expect(result.wordsHistogram).toMatchObject({
      foo: 2,
      bar: 34,
    });
  });

  // not a very UNIT test, but is easy enough to be implemented here and is valuable
  it('should return expected values from lorem ipsum test file', async () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/lorem.txt').toString();
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

    const result = await contentAnalyzer.analyze(data);

    expect(result.lettersCount).toBe(369);
    expect(result.spacesCount).toBe(67);
    expect(result.wordsCount).toBe(69);
    expect(result.wordsHistogram).toMatchObject(expectedHistogram);
  });

  afterEach(() => {
    if (spy) {
      spy.lettersAnalyzer.mockRestore();
      spy.spacesAnalyzer.mockRestore();
      spy.wordsAnalyzer.mockRestore();
    }
  });
});
