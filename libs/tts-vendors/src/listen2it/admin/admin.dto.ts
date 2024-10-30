import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export const WorkspaceMaxCharacterOptions = {
  '5m': 5000000,
  '10m': 10000000,
  '20m': 20000000,
} as const;

const WORKSPACE_MAX_CHARACTER_OPTIONS = Object.values(
  WorkspaceMaxCharacterOptions,
);
const WORKSPACE_SPEECH_PLANS = ['standard', 'neural'] as const;

export type WorkspaceSpeechPlan = (typeof WORKSPACE_SPEECH_PLANS)[number];
export type WorkspaceMaxCharacterOption =
  (typeof WORKSPACE_MAX_CHARACTER_OPTIONS)[number];
export type WorkspaceSubscriptionStatus = 'active' | 'suspended';

export class l2i_CreateOrEditWorkspaceDto {
  @IsNotEmpty()
  name: string;

  @IsIn(Object.values(WorkspaceMaxCharacterOptions))
  max_characters: number;

  @IsNotEmpty()
  account_id: string;

  @IsNotEmpty()
  @IsEmail()
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

export class l2i_Workspace {
  id: string;
  name: string;
  api_key: string;
  can_use_premium: boolean;
  can_use_standard: boolean;
  can_use_cloning: boolean;
  can_use_lite: boolean;
  max_characters: WorkspaceMaxCharacterOption;
  subscription_status: WorkspaceSubscriptionStatus;
  created_at: Date;
  updated_at: Date;
  plan_id: WorkspaceSpeechPlan;
  email: string;
  first_name: string;
  last_name: string;
  account_id: string;
  usage: {
    characters_used: number;
    created_at: Date;
    updated_at: Date;
  };
}

export class l2i_WorkspaceCreatedDto {
  id: string;
  name: string;
  max_characters: WorkspaceMaxCharacterOption;
  subscription_status: WorkspaceSubscriptionStatus;
}
