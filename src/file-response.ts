export class FileResponse {
  public content: object;
  public fileName: string;
  public contentType: string;

  constructor(content: object, fileName: string, contentType: string) {
    this.content = content;
    this.fileName = fileName;
    this.contentType = contentType;
  }
}