import {
  l2i_CreateOrEditWorkspaceDto,
  l2i_WorkspaceCreatedDto,
} from '@app/tts-vendors/listen2it/admin/admin.dto';
import { AccountIdAlreadyExistsException } from '@app/tts-vendors/listen2it/admin/admin.exceptions';
import { AdminService } from '@app/tts-vendors/listen2it/admin/admin.service';
import { WorkspaceModel } from '@app/tts-vendors/listen2it/workspace/workspace.model';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly l2iAdminService: AdminService,
    private readonly l2iWorkspaceModel: WorkspaceModel,
  ) {}

  async create(body: CreateUserDto) {
    switch (body.vendor) {
      case 'listen2it':
        if (await this.l2iWorkspaceModel.findByAccountID(body.userId)) {
          this.logger.debug(
            `listen2it workspace for user id: ${body.userId} already exists`,
            UserService.name,
            'create',
          );
          throw new HttpException(
            `Provided user id is already integrated for listen2it.`,
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        const nameParts = body.name.split(' ');
        let firstName = nameParts[0];
        let lastName = '';
        if (nameParts.length > 2) {
          lastName = nameParts[nameParts.length - 1];
          firstName = nameParts.slice(0, nameParts.length - 1).join(' ');
        } else if (nameParts.length === 2) {
          lastName = nameParts[1];
        }

        const createWorkspacePayload = new l2i_CreateOrEditWorkspaceDto();
        createWorkspacePayload.name = 'client-workspace-' + body.clientId;
        createWorkspacePayload.account_id = body.userId;
        createWorkspacePayload.email = body.email;
        createWorkspacePayload.first_name = firstName;
        createWorkspacePayload.last_name = lastName;
        createWorkspacePayload.max_characters = body.maxCharacters;
        createWorkspacePayload.speech_plan = body.speechPlan;
        createWorkspacePayload.can_use_lite = true;
        createWorkspacePayload.can_use_standard = true;
        createWorkspacePayload.can_use_premium = true;
        createWorkspacePayload.can_use_cloning = true;

        this.logger.log(
          `listen2it workspace for user id: ${body.userId} being created`,
          UserService.name,
          'create',
        );
        let response: l2i_WorkspaceCreatedDto = null;
        try {
          response = await this.l2iAdminService.createWorkspace(
            createWorkspacePayload,
          );
        } catch (err) {
          if (err instanceof AccountIdAlreadyExistsException) {
            createWorkspacePayload.account_id =
              body.userId + Math.ceil(Math.random() * 10000) / 10000;
            response = await this.l2iAdminService.createWorkspace(
              createWorkspacePayload,
            );
          } else throw err;
        }
        return !!response;
      case 'aws':
      case 'google':
        throw new HttpException(
          'This feature is not implemented yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  async deleteL2iWorkspace(userID: number) {
    const workspace = await this.l2iWorkspaceModel.findByAccountID(userID);
    if (workspace) {
      this.logger.log(
        `listen2it workspace for user id: ${userID} getting removed`,
        UserService.name,
        'deleteL2iWorkspace',
      );

      return this.l2iAdminService.deleteWorkspace(workspace.workspaceID);
    } else {
      this.logger.debug(
        `listen2it workspace for user id: ${userID} does not exists`,
        UserService.name,
        'deleteL2iWorkspace',
      );
      throw new HttpException(
        `Provided user id is not integrated for listen2it.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getL2iWorkspace(userID: number, getAllDetails: boolean) {
    const workspace = await this.l2iWorkspaceModel.findByAccountID(userID);
    if (!workspace) {
      this.logger.debug(
        `listen2it workspace for user id: ${userID} does not exists`,
        UserService.name,
        'getL2iWorkspace',
      );
      throw new HttpException(
        {
          message: `Provided user id is not integrated for listen2it.`,
          data: {},
        },
        HttpStatus.NOT_FOUND,
      );
    }
    let userDetails: any = {};
    if (getAllDetails) {
      const l2iWorkspace = await this.l2iAdminService.getWorkspace(
        workspace.workspaceID,
      );
      userDetails = {
        name:
          l2iWorkspace.first_name +
          (l2iWorkspace.last_name ? ' ' + l2iWorkspace.last_name : ''),
        email: l2iWorkspace.email,
        speechPlan: l2iWorkspace.plan_id,
      };
    }

    return {
      ...userDetails,
      userId: userID,
      maxCharacters: workspace.maxCharacters,
      usage: workspace.usage,
      updatedAt: workspace.updatedAt,
    };
  }
}
