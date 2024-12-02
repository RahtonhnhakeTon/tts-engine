import { IsIn, IsNotEmpty } from 'class-validator';

export const TTS_VENDORS = ['listen2it', 'google', 'aws'] as const;
export const TTS_LANG = ['en-IN', 'hi-IN'] as const;

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

  @IsNotEmpty()
  voiceId: string;

  traceId?: string;
}
