import { Controller, Post, Body, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { VPSService } from './vps.service';
import { PackVISDto } from './dto/pack-vis.dto';
import { PackPISDto } from './dto/pack-pis.dto';
import { PackCloseVISDto } from './dto/pack-closevis.dto';
import { PackResultDto } from './dto/pack-result.dto';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Validate Packing')
@Controller('packing/vps')
export class VPSController {
  constructor(private readonly service: VPSService) {}

  /**
   * Validate VIS and return corresponding PIS list
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   */
  @Post('check-vis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate VIS and return PIS list' })
  @ApiBody({ type: PackVISDto })
  @ApiResponse({ status: 200, type: PackResultDto })
  async checkVIS(
    @Body() body: PackVISDto
  ): Promise<PackResultDto> {
    return this.service.checkVIS(body.vis, body.userId, body.useLocaltb);
  }

  /**
   * Validate and save PIS for selected VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-12-17
   */
  @Post('confirm-pis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate and save PIS for VIS' })
  @ApiBody({ type: PackPISDto })
  @ApiResponse({ status: 200, type: PackResultDto })
  async confirmPIS(
    @Body() body: PackPISDto
  ): Promise<PackResultDto> {
    return this.service.checkPIS(body.vis, body.pis, body.userId);
  }

  /**
   * Validate shipping mark and close VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-12-12
   */
  @Post('check-closevis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate shipping mark and close VIS' })
  @ApiResponse({ status: 200, type: PackResultDto })
  async checkCloseVIS(
    @Body() body: PackCloseVISDto
  ): Promise<PackResultDto> {
    return this.service.checkCloseVIS(body.vis, body.shipcode, body.userId);
  }

  /**
   * Handle get lost items for a VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-12-19
   */
  @Post('lost-item')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lost items for a VIS' })
  @ApiResponse({ status: 200, type: PackResultDto })
  async lostItem(
    @Body() body: PackVISDto
  ): Promise<PackResultDto> {
    return this.service.getLostItem(body.vis, body.userId);
  }
}
