import { Stream } from "stream";

export class FileResponse {
  public content: object;
  public fileName: string;
  public contentType: string;

  constructor(content: Stream | Buffer, fileName: string, contentType: string) {
    this.content = content;
    this.fileName = fileName;
    this.contentType = contentType;
  }
}