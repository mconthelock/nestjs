import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus, BadRequestException , Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { VPSService } from './vps.service';
import { PackVISDto } from './dto/pack-vis.dto';
import { PackItemDto } from './dto/pack-item.dto';

@ApiTags('Validate Packing')
@Controller('packing/vps')
export class VPSController {
  constructor(private readonly vpsService: VPSService) {}



  @Get('test-log')
  @ApiOperation({ summary: 'Test SQL error log insertion' })
  async testLog(): Promise<any> {
    const data = await this.vpsService.listPIS('07C128A95807', '15234', false);
    return JSON.stringify(data, null, 2);
  }



  /**
   * Check VIS info and return corresponding PIS list
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {PackVISDto} body Payload containing VIS
   * @param   {Request} request HTTP request to read cookie UserId/UseLocaltb
   * @param   {Response} response HTTP response
   * @return  {Promise<PackItemDto>} List of items or error message
   */
  @Post('check-vis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check VIS info' })
  @ApiBody({ type: PackVISDto })
  @ApiResponse({ status: 200, description: 'List of items', type: [PackItemDto] })
  async checkVIS(@Body() body: PackVISDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<PackItemDto> {
    const cookie = request.cookies['NodeJS.Packinguser'];
    if (!cookie) {
      throw new BadRequestException('User cookie not found');
    }
    
    const user = JSON.parse(cookie);
    return this.vpsService.checkVIS(body.vis, user.userId, user.useLocaltb);
  }

  /**
   * Save PIS detail for a VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {any} body Payload containing vis and pis
   * @param   {Request} request HTTP request to read cookie UserId
   * @param   {Response} response HTTP response
   * @return  {Promise<PackItemDto>} Result of saving PIS
   */
  @Post('check-pis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check PIS detail' })
  @ApiResponse({ status: 200, description: 'PIS result', type: [PackItemDto] })
  async checkPis(@Body() body: any, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<PackItemDto> {
    const { vis, pis } = body;
    const userId = request.cookies['UserId'];
    return this.vpsService.checkPisDetail(vis, pis, userId);
  }

  /**
   * Check barcode input for closing VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {any} body Payload containing vis and barcode
   * @param   {Request} request HTTP request to read cookie UserId
   * @param   {Response} response HTTP response
   * @return  {Promise<PackItemDto>} Result of barcode check
   */
  @Post('check-bc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check barcode input for closing VIS' })
  @ApiResponse({ status: 200, description: 'Barcode check result', type: [PackItemDto] })
  async checkInputBc(@Body() body: any, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<PackItemDto> {
    const userId = request.cookies['UserId'];
    return this.vpsService.checkInputBc(body.vis, body.barcode, userId);
  }

  /**
   * Handle get lost items for a VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {any} body Payload containing vis
   * @param   {Request} request HTTP request to read cookie UserId
   * @param   {Response} response HTTP response
   * @return  {Promise<boolean>} True if lost item exists
   */
  @Post('lost-item')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lost items for a VIS' })
  @ApiResponse({ status: 200, description: 'Lost item check result', type: Boolean })
  async lostItem(@Body() body: any, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<boolean> {
    const userId = request.cookies['UserId'];
    return this.vpsService.getLostItem(body.vis, userId);
  }
}
