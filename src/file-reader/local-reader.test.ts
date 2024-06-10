import { LocalFileReader } from './local-reader';
import fs from 'fs';

describe('Local file reader', () => {
  let localFileReader: LocalFileReader;

  beforeEach(() => {
    localFileReader = new LocalFileReader();
  });

  describe('match method', () => {
    it('should not match if empty path', async () => {
      expect(await localFileReader.match('')).toBe(false);
    });

    it('should not match for remote files', async () => {
      expect(
        await localFileReader.match('https://raw.githubusercontent.com/c3s4/userbot-entry-test/main/LICENSE'),
      ).toBe(false);
    });

    it('should not match if file does not exists', async () => {
      expect(await localFileReader.match('./foo.bar')).toBe(false);
    });

    it('should match for local files', async () => {
      expect(await localFileReader.match(__dirname + '/../../test-data/lorem.txt')).toBe(true);
    });
  });

  describe('readData method', () => {
    let matchMock: jest.SpyInstance;

    it('should return null because no match and no successor', async () => {
      matchMock = jest.spyOn(localFileReader, 'match').mockImplementation(async (filePath: string) => false);
      const res = await localFileReader.readData('a file path');
      expect(res).toBe(null);
    });

    it('should call readData on successor', async () => {
      matchMock = jest.spyOn(localFileReader, 'match').mockImplementation(async (filePath: string) => false);
      const fakeFilePath = 'fake/file/path';
      const locReader2 = new LocalFileReader();
      const localReader2Spy = jest.spyOn(locReader2, 'readData');

      localFileReader.setNext(locReader2);
      const res = await localFileReader.readData(fakeFilePath);
      expect(localReader2Spy).toHaveBeenCalledWith(fakeFilePath);
    });

    it('should return null because of error on reading file', async () => {
      matchMock = jest.spyOn(localFileReader, 'match').mockImplementation(async (filePath: string) => true);
      const fakeFilePath = 'fake/file/path';
      const readFileSpy = jest.spyOn(fs.promises, 'readFile').mockImplementation(() => {
        throw new Error();
      });

      const res = await localFileReader.readData(fakeFilePath);
      expect(readFileSpy).toHaveBeenCalledWith(fakeFilePath);
      expect(res).toBe(null);
    });

    it('should return the string from readFile function', async () => {
      matchMock = jest.spyOn(localFileReader, 'match').mockImplementation(async (filePath: string) => true);
      const fakeFilePath = 'fake/file/path';
      const fakeFileContent = 'fake content';
      const readFileSpy = jest.spyOn(fs.promises, 'readFile').mockImplementation(async () => {
        return Buffer.from(fakeFileContent, 'utf8');
      });

      const res = await localFileReader.readData(fakeFilePath);
      expect(readFileSpy).toHaveBeenCalledWith(fakeFilePath);
      expect(res).toBe(fakeFileContent);
    });

    afterEach(() => {
      matchMock?.mockRestore();
    });
  });
});
