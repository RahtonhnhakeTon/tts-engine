import { IsIn, IsNotEmpty } from 'class-validator';

const TTS_TEXT_TYPES = ['text', 'ssml'] as const;
export type TtsTextTypes = (typeof TTS_TEXT_TYPES)[number];

export class l2i_GenerateTtsDto {
  @IsIn(TTS_TEXT_TYPES)
  type: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  voice_id: string;

  language: string;
}
