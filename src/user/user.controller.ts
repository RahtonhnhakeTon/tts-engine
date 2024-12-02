import * as NestCommons from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TtsVendors } from '../tts/tts.dto';
import { CreateL2iWorkspaceDto, EditL2iWorkspaceDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@NestCommons.Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @NestCommons.Post('setup/:vendor')
  async create(
    @NestCommons.Param('vendor') vendor: TtsVendors,
    @NestCommons.Body() body: CreateL2iWorkspaceDto,
  ) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: await this.userService.createL2iWorkspace(body),
        };
      case 'aws':
      case 'google':
        throw new NestCommons.HttpException(
          'This vendor is not integrated yet',
          NestCommons.HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @NestCommons.Get(':id/:vendor')
  async get(
    @NestCommons.Param('id') id: string,
    @NestCommons.Param('vendor') vendor: TtsVendors,
    @NestCommons.Query('detailed') showAll: boolean,
  ) {
    switch (vendor) {
      case 'listen2it':
        const workspace = await this.userService.getL2iWorkspace(
          parseInt(id),
          showAll,
        );

        return {
          success: true,
          data: workspace,
        };
      case 'aws':
      case 'google':
        throw new NestCommons.HttpException(
          'This vendor is not integrated yet',
          NestCommons.HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @NestCommons.Delete(':id/:vendor')
  async delete(
    @NestCommons.Param('id') id: string,
    @NestCommons.Param('vendor') vendor: TtsVendors,
  ) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: await this.userService.deleteL2iWorkspace(parseInt(id)),
        };
      case 'aws':
      case 'google':
        throw new NestCommons.HttpException(
          'This vendor is not integrated yet',
          NestCommons.HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @NestCommons.Put(':id/:vendor')
  async edit(
    @NestCommons.Param('id') id: string,
    @NestCommons.Param('vendor') vendor: TtsVendors,
    @NestCommons.Body() body: EditL2iWorkspaceDto,
  ) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: await this.userService.editL2iWorkspace(parseInt(id), body),
        };
      case 'aws':
      case 'google':
        throw new NestCommons.HttpException(
          'This vendor is not integrated yet',
          NestCommons.HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @Get(':id/:vendor/voices')
  async getVoices(
    @NestCommons.Param('id') id: string,
    @NestCommons.Param('vendor') vendor: TtsVendors,
  ) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: true,
          data: await this.userService.getL2iVoices(parseInt(id)),
        };
      case 'aws':
      case 'google':
        throw new NestCommons.HttpException(
          'This vendor is not integrated yet',
          NestCommons.HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }
}
