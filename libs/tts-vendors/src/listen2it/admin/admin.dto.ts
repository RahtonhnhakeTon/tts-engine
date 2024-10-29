import { IsIn, IsNotEmpty } from 'class-validator';

export const WorkspaceMaxCharacterOptions = {
  '5m': 5000000,
  '10m': 10000000,
  '20m': 20000000,
};

const WORKSPACE_SPEECH_PLANS = ['standard', 'neural'] as const;

export type WorkspaceSpeechPlans = (typeof WORKSPACE_SPEECH_PLANS)[number];

export class l2i_CreateOrEditWorkspaceDto {
  @IsNotEmpty()
  name: string;

  @IsIn(Object.values(WorkspaceMaxCharacterOptions))
  max_characters: number;

  @IsNotEmpty()
  account_id: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsIn(WORKSPACE_SPEECH_PLANS)
  speech_plan: string;

  can_use_lite: boolean;
  can_use_standard: boolean;
  can_use_premium: boolean;
  can_use_cloning: boolean;
}
