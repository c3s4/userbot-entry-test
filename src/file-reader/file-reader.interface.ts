export interface FileReaderInterface {
  setNext: (next: FileReaderInterface) => void;
  getNext: () => FileReaderInterface | undefined;
  match: (filePath: string) => Promise<boolean>;
  readData: (filePath: string) => Promise<string | null>;
}

export abstract class FileReaderHandler implements FileReaderInterface {
  private next: FileReaderInterface | undefined;

  setNext(next: FileReaderInterface) {
    this.next = next;
  }

  getNext() {
    return this.next;
  }

  abstract match(filePath: string): Promise<boolean>;
  abstract readData(filePath: string): Promise<string | null>;
}
