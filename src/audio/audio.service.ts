import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as FileSystem from 'fs';
import { Lame } from 'node-lame';
import { lastValueFrom } from 'rxjs';
import { Audio } from './audio.schema';

@Injectable()
export class AudioService {
  constructor(private readonly http: HttpService) {}

  async fetchOverHTTP(audio: Audio, publicUrl: string) {
    const urlResponse = await lastValueFrom(
      this.http
        .request({
          url: publicUrl,
          responseType: 'stream',
        })
        .pipe(),
    );

    const fileStream = FileSystem.createWriteStream(audio.getAbsolutePath());
    await fileStream.pipe(urlResponse.data);

    audio.isAvailableLocally = FileSystem.existsSync(audio.getAbsolutePath());

    return audio.isAvailableLocally;
  }

  async resampleForAsteriskStandards(
    audio: Audio,
    newName: string,
    deleteOriginal: boolean = true,
  ) {
    const encoder = new Lame({
      output: audio.path + newName,
      bitwidth: 8,
      resample: 22.05,
      lowpass: 3.4,
      highpass: 200,
    }).setFile(audio.getAbsolutePath());

    await encoder.encode();

    if (encoder.getStatus().finished) {
      if (deleteOriginal) FileSystem.rmSync(audio.getAbsolutePath());
      audio.name = newName;
      return true;
    }
    return false;
  }
}
