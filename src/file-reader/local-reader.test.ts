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
      matchMock = jest.spyOn(localFileReader, 'match').mockResolvedValue(false);
      const res = await localFileReader.readData('a file path');
      expect(res).toBe(null);
    });

    it('should call readData on successor', async () => {
      matchMock = jest.spyOn(localFileReader, 'match').mockResolvedValue(false);
      const fakeFilePath = 'fake/file/path';
      const locReader2 = new LocalFileReader();
      const localReader2Spy = jest.spyOn(locReader2, 'readData');

      localFileReader.setNext(locReader2);
      await localFileReader.readData(fakeFilePath);
      expect(localReader2Spy).toHaveBeenCalledWith(fakeFilePath);
    });

    it('should return null because of error in getContents', async () => {
      matchMock = jest.spyOn(localFileReader, 'match').mockResolvedValue(true);
      const getContentsMock = jest.spyOn(localFileReader, 'getContents').mockImplementation(() => {
        throw new Error();
      });
      const fakeFilePath = 'fake/file/path';

      const res = await localFileReader.readData(fakeFilePath);
      expect(getContentsMock).toHaveBeenCalledWith(fakeFilePath);
      expect(res).toBe(null);

      getContentsMock.mockRestore();
    });

    it('should call getContents', async () => {
      matchMock = jest.spyOn(localFileReader, 'match').mockResolvedValue(true);
      const getContentsMock = jest.spyOn(localFileReader, 'getContents');
      const fakeFilePath = 'fake/file/path';

      await localFileReader.readData(fakeFilePath);
      expect(getContentsMock).toHaveBeenCalledWith(fakeFilePath);

      getContentsMock.mockRestore();
    });

    afterEach(() => {
      matchMock?.mockRestore();
    });
  });

  describe('getContents method', () => {
    it('should throw exception because of error on reading file', async () => {
      const fakeFilePath = 'fake/file/path';
      const readFileSpy = jest.spyOn(fs.promises, 'readFile').mockImplementation(() => {
        throw new Error();
      });

      const getContentsPromise = localFileReader.getContents(fakeFilePath);
      expect(getContentsPromise).rejects.toThrow();
      expect(readFileSpy).toHaveBeenCalledWith(fakeFilePath);
    });

    it('should return the string from readFile function', async () => {
      const fakeFilePath = 'fake/file/path';
      const fakeFileContent = 'fake content';
      const readFileSpy = jest.spyOn(fs.promises, 'readFile').mockImplementation(async () => {
        return Buffer.from(fakeFileContent, 'utf8');
      });

      const res = await localFileReader.getContents(fakeFilePath);
      expect(readFileSpy).toHaveBeenCalledWith(fakeFilePath);
      expect(res).toBe(fakeFileContent);
    });
  });
});
