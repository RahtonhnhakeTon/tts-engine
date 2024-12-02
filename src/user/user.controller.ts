import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TtsVendors } from '../tts/tts.dto';
import { CreateL2iWorkspaceDto, EditL2iWorkspaceDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('setup/:vendor')
  async create(
    @Param('vendor') vendor: TtsVendors,
    @Body() body: CreateL2iWorkspaceDto,
  ) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: await this.userService.createL2iWorkspace(body),
        };
      case 'aws':
      case 'google':
        throw new HttpException(
          'This vendor is not integrated yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @Get(':id/:vendor')
  async get(
    @Param('id') id: string,
    @Param('vendor') vendor: TtsVendors,
    @Query('detailed') showAll: boolean,
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
        throw new HttpException(
          'This vendor is not integrated yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @Delete(':id/:vendor')
  async delete(@Param('id') id: string, @Param('vendor') vendor: TtsVendors) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: await this.userService.deleteL2iWorkspace(parseInt(id)),
        };
      case 'aws':
      case 'google':
        throw new HttpException(
          'This vendor is not integrated yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @Put(':id/:vendor')
  async edit(
    @Param('id') id: string,
    @Param('vendor') vendor: TtsVendors,
    @Body() body: EditL2iWorkspaceDto,
  ) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: await this.userService.editL2iWorkspace(parseInt(id), body),
        };
      case 'aws':
      case 'google':
        throw new HttpException(
          'This vendor is not integrated yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  @Get(':id/:vendor/voices')
  async getVoices(
    @Param('id') id: string,
    @Param('vendor') vendor: TtsVendors,
  ) {
    switch (vendor) {
      case 'listen2it':
        return {
          success: true,
          data: await this.userService.getL2iVoices(parseInt(id)),
        };
      case 'aws':
      case 'google':
        throw new HttpException(
          'This vendor is not integrated yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }
}
