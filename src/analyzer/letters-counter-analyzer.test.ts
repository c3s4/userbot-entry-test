import { LettersCounterAnalyzer } from './letters-counter-analyzer';
import fs from 'fs';

describe('Letter counter analyzer', () => {
  const analyzer = new LettersCounterAnalyzer();
  beforeEach(() => {});
  it('should exists', () => {
    expect(analyzer).toBeDefined();
  });

  it('analyze function should exist', () => {
    expect(analyzer.analyze).toBeDefined();
  });

  it('should return expected count', () => {
    const data = 'aBcd';
    expect(analyzer.analyze(data)).toMatchObject({
      lettersCount: 4,
    });
  });
  it('should return value excluding digits', () => {
    const data = '741tEOsjKj9Cz4iy 23asd';
    expect(analyzer.analyze(data)).toMatchObject({
      lettersCount: 14,
    });
  });

  it('should return 0 because an empty string', () => {
    const data = '';
    expect(analyzer.analyze(data)).toMatchObject({
      lettersCount: 0,
    });
  });

  it('should return a count greater than 0 from bin file', () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/test.bin').toString();

    expect(analyzer.analyze(data).lettersCount).toBeGreaterThan(0);
    expect(analyzer.analyze(data).lettersCount).not.toBe(data.length);
  });

  it('should return the right count from text file', () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/lorem.txt').toString();

    expect(analyzer.analyze(data).lettersCount).toBe(369);
    expect(analyzer.analyze(data).lettersCount).not.toBe(data.length);
  });
});
