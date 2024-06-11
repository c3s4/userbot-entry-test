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

  async getContents(filePath: string): Promise<string | null> {
    const content = await fs.promises.readFile(filePath);
    return content.toString();
  }
}
