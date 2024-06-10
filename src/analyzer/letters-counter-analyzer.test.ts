import { LettersCounterAnalyzer } from './letters-counter-analyzer';
import fs from 'fs';

describe('Letter counter analyzer', () => {
  const analyzer = new LettersCounterAnalyzer();
  it('should exists', () => {
    expect(analyzer).toBeDefined();
  });

  it('analyze function should exist', () => {
    expect(analyzer.analyze).toBeDefined();
  });

  it('should return expected count', async () => {
    const data = 'aBcd';
    expect(await analyzer.analyze(data)).toMatchObject({
      lettersCount: 4,
    });
  });
  it('should return value excluding digits', async () => {
    const data = '741tEOsjKj9Cz4iy 23asd';
    expect(await analyzer.analyze(data)).toMatchObject({
      lettersCount: 14,
    });
  });

  it('should return 0 because an empty string', async () => {
    const data = '';
    expect(await analyzer.analyze(data)).toMatchObject({
      lettersCount: 0,
    });
  });

  it('should return a count greater than 0 from bin file', async () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/test.bin').toString();
    const result = await analyzer.analyze(data);

    expect(result.lettersCount).toBeGreaterThan(0);
    expect(result.lettersCount).not.toBe(data.length);
  });

  it('should return the right count from text file', async () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/lorem.txt').toString();
    const result = await analyzer.analyze(data);

    expect(result.lettersCount).toBe(369);
    expect(result.lettersCount).not.toBe(data.length);
  });
});
