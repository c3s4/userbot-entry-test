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

  describe('readData method', () => {
    let matchMock: jest.SpyInstance;
    let getSpy: jest.SpyInstance;

    it('should return null because no match and no successor', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockImplementation(async (filePath: string) => false);
      const res = await httpFileReader.readData('a file path');
      expect(res).toBe(null);
    });

    it('should call readData on successor', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockImplementation(async (filePath: string) => false);
      const fakeFilePath = 'fake/file/path';
      const httpReader2 = new HttpFileReader();
      const httpReader2Spy = jest.spyOn(httpReader2, 'readData');

      httpFileReader.setNext(httpReader2);
      await httpFileReader.readData(fakeFilePath);
      expect(httpReader2Spy).toHaveBeenCalledWith(fakeFilePath);
    });

    it('should return null because of error on reading remote file', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockImplementation(async (filePath: string) => true);
      const fakeFilePath = 'fake/file/path';
      getSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
        throw new Error();
      });

      const res = await httpFileReader.readData(fakeFilePath);
      expect(getSpy).toHaveBeenCalled();
      expect(res).toBe(null);
    });

    it('should return expected string content', async () => {
      matchMock = jest.spyOn(httpFileReader, 'match').mockImplementation(async (filePath: string) => true);
      const fakeFilePath = '/fake/file/path';
      const fakeContent = 'fake content';
      getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
        data: fakeContent,
      });

      const res = await httpFileReader.readData(fakeFilePath);
      expect(getSpy).toHaveBeenCalled();
      expect(res).toBe(fakeContent);
    });

    afterEach(() => {
      matchMock?.mockRestore();
      getSpy?.mockRestore();
    });
  });
});
