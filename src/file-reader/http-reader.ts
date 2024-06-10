import { FileReaderHandler } from './file-reader.interface';
import axios from 'axios';

export class HttpFileReader extends FileReaderHandler {
  async match(filePath: string) {
    try {
      const url = new URL(filePath);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }

  async getContents(filePath: string): Promise<string | null> {
    const content = await axios.get(filePath);
    return content.data;
  }
}
