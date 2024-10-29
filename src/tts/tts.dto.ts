import { IsIn, ValidateIf } from 'class-validator';

const TTS_VENDORS = ['listen2it', 'google', 'aws'] as const;

export type TtsVendors = (typeof TTS_VENDORS)[number];

export class GenerateTtsDto {
  @IsIn(TTS_VENDORS)
  vendor: TtsVendors;

  @ValidateIf((object) => object.vendor === 'listen2it')
  workspace_id: string;
}
