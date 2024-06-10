export interface FileReaderInterface {
  setNext: (next: FileReaderInterface) => void;
  getNext: () => FileReaderInterface | undefined;
  readData: (filePath: string) => Promise<string | null>;
  match: (filePath: string) => Promise<boolean>;
  getContents: (filePath: string) => Promise<string | null>;
}

export abstract class FileReaderHandler implements FileReaderInterface {
  private next: FileReaderInterface | undefined;

  setNext(next: FileReaderInterface) {
    this.next = next;
  }

  getNext() {
    return this.next;
  }

  async readData(filePath: string) {
    const isMatching = await this.match(filePath);
    if (isMatching) {
      try {
        return await this.getContents(filePath);
      } catch (err) {
        return null;
      }
    } else {
      const successor = this.getNext();
      if (successor) {
        return await successor.readData(filePath);
      }
    }

    return null;
  }

  abstract match(filePath: string): Promise<boolean>;
  abstract getContents(filePath: string): Promise<string | null>;
}
