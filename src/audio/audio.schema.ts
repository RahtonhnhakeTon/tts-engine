import { join } from 'path';

export class Audio {
  filename: string;
  extension: string;
  path: string;
  isAvailableLocally: boolean = false;

  constructor(options: AudioMetaOptions) {
    this.path = options.path;
    if (options.extension) {
      this.filename = options.name;
      this.extension = options.extension;
    } else {
      this.name = options.name;
    }

    this.isAvailableLocally = !!options.isAvailableLocally;
  }

  set name(name: string) {
    const nameParts = name.split('.');
    this.filename = nameParts[0];
    this.extension = name.substring(nameParts[0].length);
  }

  getFilenameWithExtension = () => this.filename + '.' + this.extension;

  getAbsolutePath = () => join(this.path, this.getFilenameWithExtension());
}

export class AudioMetaOptions {
  name: string;
  path: string;
  extension?: string;
  isAvailableLocally?: boolean = false;
}
