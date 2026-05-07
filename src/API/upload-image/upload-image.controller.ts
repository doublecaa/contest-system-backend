import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { Auth } from '../../common/decorators/guard.decorator';
import { Roles } from '../../common/enums/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('upload-image')
@ApiBearerAuth()
@ApiTags('Common - UploadImageAPI')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post()
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'upload image' })
  uploadImage(
    @Body() createUploadImageDto: CreateUploadImageDto,
    @Req() req: any,
  ) {
    return this.uploadImageService.uploadImage(createUploadImageDto, req);
  }
}
