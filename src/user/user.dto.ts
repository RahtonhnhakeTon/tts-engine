import {
  WORKSPACE_SPEECH_PLANS,
  WorkspaceMaxCharacterOptions,
} from '@app/tts-vendors/listen2it/admin/admin.dto';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateL2iWorkspaceDto {
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

  @IsIn(Object.values(WorkspaceMaxCharacterOptions))
  maxCharacters: number;

  @IsIn(WORKSPACE_SPEECH_PLANS)
  speechPlan: string;

  traceId?: string;
}

export class EditL2iWorkspaceDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(Object.values(WorkspaceMaxCharacterOptions))
  maxCharacters: number;

  @IsOptional()
  @IsIn(WORKSPACE_SPEECH_PLANS)
  speechPlan: string;

  traceId?: string;
}

export type CreateUserDto = CreateL2iWorkspaceDto;
export type EditUserDto = EditL2iWorkspaceDto;
