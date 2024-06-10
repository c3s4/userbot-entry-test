import { LettersCounterAnalyzer } from './letters-counter-analyzer';
import fs from 'fs';
import { SpacesCounterAnalyzer } from './spaces-counter-analyzer';

describe('Spaces counter analyzer', () => {
  const analyzer = new SpacesCounterAnalyzer();
  it('should exists', () => {
    expect(analyzer).toBeDefined();
  });

  it('analyze function should exist', () => {
    expect(analyzer.analyze).toBeDefined();
  });

  it('should return 0', async () => {
    const data = 'aBcd';
    expect(await analyzer.analyze(data)).toMatchObject({
      spacesCount: 0,
    });
  });

  it('should count correctly also the space at the end', async () => {
    const data = 'aBcd ';
    expect(await analyzer.analyze(data)).toMatchObject({
      spacesCount: 1,
    });
  });

  it('should consider the beginning space', async () => {
    const data = ' aBcd ';
    expect(await analyzer.analyze(data)).toMatchObject({
      spacesCount: 2,
    });
  });

  it('should return expected spaces count', async () => {
    const data = ' 741 tEOsjKj9Cz4iy 23a sd ';
    expect(await analyzer.analyze(data)).toMatchObject({
      spacesCount: 5,
    });
  });

  it('should return 0 because an empty string', async () => {
    const data = '';
    expect(await analyzer.analyze(data)).toMatchObject({
      spacesCount: 0,
    });
  });

  it('should return a count greater than 0 from bin file', async () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/test.bin').toString();
    const result = await analyzer.analyze(data);

    expect(result.spacesCount).toBeGreaterThan(0);
    expect(result.spacesCount).not.toBe(data.length);
  });

  it('should return the right count from text file', async () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/lorem.txt').toString();
    const result = await analyzer.analyze(data);

    expect(result.spacesCount).toBe(67);
    expect(result.spacesCount).not.toBe(data.length);
  });
});
