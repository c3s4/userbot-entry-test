import { FileReaderHandler } from './file-reader.interface';
import { HttpFileReader } from './http-reader';
import { LocalFileReader } from './local-reader';

export class FileReader {
  private rootFileReader: FileReaderHandler;
  constructor() {
    this.rootFileReader = new LocalFileReader();
    this.rootFileReader.setNext(new HttpFileReader());
  }

  async readData(filePath: string) {
    return this.rootFileReader.readData(filePath);
  }
}
