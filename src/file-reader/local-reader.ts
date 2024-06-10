import { FileReaderHandler } from './file-reader.interface';
import fs from 'fs';

export class LocalFileReader extends FileReaderHandler {
  async match(filePath: string) {
    try {
      const stats = await fs.promises.stat(filePath);
      return stats.isFile();
    } catch (err) {
      return false;
    }
  }

  async readData(filePath: string): Promise<string | null> {
    const isMatching = await this.match(filePath);
    if (isMatching) {
      try {
        const content = await fs.promises.readFile(filePath);
        return content.toString();
      } catch (err) {
        return null;
      }
    } else {
      const successor = this.getNext();
      if (successor) {
        return successor.readData(filePath);
      }
    }
    return null;
  }
}
