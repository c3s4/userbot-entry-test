import { LettersCounterAnalyzer } from './letters-counter-analyzer';
import fs from 'fs';
import { SpacesCounterAnalyzer } from './spaces-counter-analyzer';

describe('Spaces counter analyzer', () => {
  const analyzer = new SpacesCounterAnalyzer();
  beforeEach(() => {});
  it('should exists', () => {
    expect(analyzer).toBeDefined();
  });

  it('analyze function should exist', () => {
    expect(analyzer.analyze).toBeDefined();
  });

  it('should return 0', () => {
    const data = 'aBcd';
    expect(analyzer.analyze(data)).toMatchObject({
      spacesCount: 0,
    });
  });

  it('should count correctly also the space at the end', () => {
    const data = 'aBcd ';
    expect(analyzer.analyze(data)).toMatchObject({
      spacesCount: 1,
    });
  });

  it('should consider the beginning space', () => {
    const data = ' aBcd ';
    expect(analyzer.analyze(data)).toMatchObject({
      spacesCount: 2,
    });
  });

  it('should return expected spaces count', () => {
    const data = ' 741 tEOsjKj9Cz4iy 23a sd ';
    expect(analyzer.analyze(data)).toMatchObject({
      spacesCount: 5,
    });
  });

  it('should return 0 because an empty string', () => {
    const data = '';
    expect(analyzer.analyze(data)).toMatchObject({
      spacesCount: 0,
    });
  });

  it('should return a count greater than 0 from bin file', () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/test.bin').toString();

    expect(analyzer.analyze(data).spacesCount).toBeGreaterThan(0);
    expect(analyzer.analyze(data).spacesCount).not.toBe(data.length);
  });

  it('should return the right count from text file', () => {
    const data = fs.readFileSync(__dirname + '/../../test-data/lorem.txt').toString();

    expect(analyzer.analyze(data).spacesCount).toBe(67);
    expect(analyzer.analyze(data).spacesCount).not.toBe(data.length);
  });
});
