import { IsIn, IsNotEmpty } from 'class-validator';

const TTS_VENDORS = ['listen2it', 'google', 'aws'] as const;
const TTS_LANG = ['en-IN'] as const;

export type TtsVendors = (typeof TTS_VENDORS)[number];
export type TtsLanguages = (typeof TTS_LANG)[number];

export class GenerateTtsDto {
  @IsIn(TTS_VENDORS)
  vendor: TtsVendors;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  text: string;

  @IsIn(TTS_LANG)
  language: string;

  traceId?: string;
}
