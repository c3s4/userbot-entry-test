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

  async readData(filePath: string): Promise<string | null> {
    const isMatching = await this.match(filePath);
    if (isMatching) {
      try {
        const content = await axios.get(filePath);
        return content.data;
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
