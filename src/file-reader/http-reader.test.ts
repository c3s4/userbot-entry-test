import { HttpFileReader } from './http-reader';
import axios from 'axios';

describe('Http file reader', () => {
  let httpFileReader: HttpFileReader;

  beforeEach(() => {
    httpFileReader = new HttpFileReader();
  });

  describe('match method', () => {
    it('should not match if empty path', async () => {
      expect(await httpFileReader.match('')).toBe(false);
    });

    it('should not match for local files', async () => {
      expect(await httpFileReader.match(__dirname + '/../../test-data/lorem.txt')).toBe(false);
    });

    it('should match for https remote files', async () => {
      expect(await httpFileReader.match('https://raw.githubusercontent.com/c3s4/userbot-entry-test/main/LICENSE')).toBe(
        true,
      );
    });

    it('should not match for other protocols', async () => {
      expect(await httpFileReader.match('ftp://raw.githubusercontent.com/c3s4/userbot-entry-test/main/LICENSE')).toBe(
        false,
      );

      expect(await httpFileReader.match(`file://${__dirname + '/../../test-data/lorem.txt'}`)).toBe(false);
    });

    it('should match for http remote files', async () => {
      expect(await httpFileReader.match('http://raw.githubusercontent.com/c3s4/userbot-entry-test/main/LICENSE')).toBe(
        true,
      );
    });
  });

  describe('readData methods', () => {
    let matchMock: jest.SpyInstance;
    it('should return null because no match and no successor', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockResolvedValue(false);
      const res = await httpFileReader.readData('a file path');
      expect(res).toBe(null);
    });

    it('should call readData on successor', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockResolvedValue(false);
      const fakeFilePath = 'fake/file/path';
      const httpReader2 = new HttpFileReader();
      const httpReader2Spy = jest.spyOn(httpReader2, 'readData');

      httpFileReader.setNext(httpReader2);
      await httpFileReader.readData(fakeFilePath);
      expect(httpReader2Spy).toHaveBeenCalledWith(fakeFilePath);
    });

    it('should return null because of error in getContents', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockResolvedValue(true);
      const getContentsMock = jest.spyOn(httpFileReader, 'getContents').mockImplementation(() => {
        throw new Error();
      });
      const fakeFilePath = 'fake/file/path';

      const res = await httpFileReader.readData(fakeFilePath);
      expect(getContentsMock).toHaveBeenCalledWith(fakeFilePath);
      expect(res).toBe(null);

      getContentsMock.mockRestore();
    });

    it('should call getContents', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockResolvedValue(true);
      const getContentsMock = jest.spyOn(httpFileReader, 'getContents');
      const fakeFilePath = 'fake/file/path';

      await httpFileReader.readData(fakeFilePath);
      expect(getContentsMock).toHaveBeenCalledWith(fakeFilePath);

      getContentsMock.mockRestore();
    });

    afterEach(() => {
      matchMock?.mockRestore();
    });
  });

  describe('getContents method', () => {
    let getSpy: jest.SpyInstance;

    it('should throw exception because of error on reading remote file', async () => {
      const fakeFilePath = 'fake/file/path';
      getSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
        throw new Error();
      });

      const getContentsPromise = httpFileReader.getContents(fakeFilePath);
      expect(getContentsPromise).rejects.toThrow();
      expect(getSpy).toHaveBeenCalled();
    });

    it('should return expected string content', async () => {
      const fakeFilePath = '/fake/file/path';
      const fakeContent = 'fake content';
      getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
        data: fakeContent,
      });

      const res = await httpFileReader.getContents(fakeFilePath);
      expect(getSpy).toHaveBeenCalled();
      expect(res).toBe(fakeContent);
    });

    afterEach(() => {
      getSpy?.mockRestore();
    });
  });
});
