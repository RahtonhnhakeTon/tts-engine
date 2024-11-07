import {
  WORKSPACE_SPEECH_PLANS,
  WorkspaceMaxCharacterOptions,
} from '@app/tts-vendors/listen2it/admin/admin.dto';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { TTS_VENDORS, TtsVendors } from '../tts/tts.dto';

export class CreateUserDto {
  @IsIn(TTS_VENDORS)
  vendor: TtsVendors;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((obj: any, value: string) => obj.vendor === 'listen2it')
  @IsIn(Object.values(WorkspaceMaxCharacterOptions))
  maxCharacters: number;

  @ValidateIf((obj: any, value: string) => obj.vendor === 'listen2it')
  @IsIn(WORKSPACE_SPEECH_PLANS)
  speechPlan: string;

  traceId?: string;
}
