declare module '@slowpoison/file-generator' {
  export type FileGeneratorOptions = {
    includeNewLines: boolean,
    initialBufferLength: number,
  }
  export class FileGenerator {
    constructor(path: string, userOptions?: FileGeneratorOptions);
    genLines(): Generator<string>;
  }
}
