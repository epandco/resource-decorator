/// <reference types="node" />
import { Stream } from "stream";
export declare class FileResponse {
    content: object;
    fileName: string;
    contentType: string;
    constructor(content: Stream | Buffer, fileName: string, contentType: string);
}
