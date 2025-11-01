import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SourceService } from './source.service';
import { GetFileContentDto } from './dto/file-content.dto';

@Controller('docinv/source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('compare')
  compareFolders() {
    return this.sourceService.compareFolders();
  }

  @Post('file-content')
  async getFileContent(@Body() getFileContentDto: GetFileContentDto) {
    try {
      const { file, id } = getFileContentDto;
      return await this.sourceService.getFileContent(id, file);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found: ${error.path}`);
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
