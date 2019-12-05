/**
 * If thrown will result in a 400 back to the client
 * rendered correctly for the route.
 */
export declare class ResourceError {
    msg: string;
    constructor(msg: string);
}
