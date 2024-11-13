import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('setup')
  async create(@Body() body: CreateUserDto) {
    return {
      success: await this.userService.create(body),
    };
  }

  @Get(':id/listen2it')
  async getL2iWorkspace(
    @Param('id') id: string,
    @Query('detailed') showAll: boolean,
  ) {
    const workspace = await this.userService.getL2iWorkspace(
      parseInt(id),
      showAll,
    );

    return {
      success: true,
      data: workspace,
    };
  }

  @Delete(':id/listen2it')
  async deleteL2iWorkspace(@Param('id') id: string) {
    return {
      success: await this.userService.deleteL2iWorkspace(parseInt(id)),
    };
  }
}
