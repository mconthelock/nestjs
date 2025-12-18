import { Controller, Post, Body, Req, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { VPSService } from './vps.service';
import { PackVISDto } from './dto/pack-vis.dto';
import { PackPISDto } from './dto/pack-pis.dto';
import { PackCloseVISDto } from './dto/pack-closevis.dto';
import { PackResultDto } from './dto/pack-result.dto';
import { IsString } from 'class-validator';

@ApiTags('Validate Packing')
@Controller('packing/vps')
export class VPSController {
  constructor(private readonly vpsService: VPSService) {}

  private getPackingUser(req: Request): { userId: string; useLocaltb: string } {
    const cookie = req.cookies?.['NodeJS.Packinguser'];
    if (!cookie) {
      throw new BadRequestException('timeout');
    }

    try {
      const user = JSON.parse(cookie);
      return {
        userId: user.userId,
        useLocaltb: user.useLocaltb,
      };
    } catch {
      throw new BadRequestException('Invalid user cookie format');
    }
  }

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
    @Body() body: PackVISDto,
    @Req() req: Request,
  ): Promise<PackResultDto> {
    const user = this.getPackingUser(req);
    return this.vpsService.checkVIS(body.vis, user.userId, user.useLocaltb);
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
    @Body() body: PackPISDto,
    @Req() req: Request,
  ): Promise<PackResultDto> {
    const user = this.getPackingUser(req);
    return this.vpsService.checkPIS(body.vis, body.pis, user.userId);
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
    @Body() body: PackCloseVISDto,
    @Req() req: Request,
  ): Promise<PackResultDto> {
    const user = this.getPackingUser(req);
    return this.vpsService.checkCloseVIS(body.vis, body.shipcode, user.userId);
  }

  /**
   * Handle get lost items for a VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-12-18
   */
  @Post('lost-item')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lost items for a VIS' })
  @ApiResponse({ status: 200, type: PackResultDto })
  async lostItem(
    @Body() body: PackVISDto,
    @Req() req: Request,
  ): Promise<PackResultDto> {
    const user = this.getPackingUser(req);
    return this.vpsService.getLostItem(body.vis, user.userId);
  }
}
