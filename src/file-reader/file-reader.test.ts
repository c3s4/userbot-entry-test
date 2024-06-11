import { FileReader } from './file-reader';
import { HttpFileReader } from './http-reader';
import { LocalFileReader } from './local-reader';

describe('File reader', () => {
  it('should call readData method on root file reader', async () => {
    const rootReaderSpy = jest.spyOn(LocalFileReader.prototype, 'readData');
    const fileReader = new FileReader();
    const fakeFilePath = '/fake/file/path';
    await fileReader.readData(fakeFilePath);
    expect(rootReaderSpy).toHaveBeenCalledWith(fakeFilePath);
  });

  it('should create all the chain as expected', async () => {
    const rootReaderSpy = jest.spyOn(LocalFileReader.prototype, 'setNext');
    new FileReader();
    expect(rootReaderSpy).toHaveBeenCalledWith(new HttpFileReader());
  });
});
