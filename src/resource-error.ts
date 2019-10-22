/**
 * If thrown will result in a 400 back to the client
 * rendered correctly for the route.
 */
export class ResourceError {
  public msg: string

  constructor(msg: string) {
    this.msg = msg;
  }
}